require 'rubygems'
require 'haml'
require 'sass'
require 'sinatra'
require 'sinatra_more/markup_plugin'
require 'sinatra_more/render_plugin'
Sinatra::Base.register SinatraMore::MarkupPlugin
Sinatra::Base.register SinatraMore::RenderPlugin

require 'fastercsv'
require 'sequel'
require 'lib/item.rb'
require 'lib/graph.rb'
require 'lib/schemeparser.rb'
require 'lib/rubyparser.rb'
require 'lib/twitterseeker.rb'

Sequel.connect(ENV['DATABASE_URL'] || 'sqlite://batch/lines.db')
require 'model/station.rb'
require 'model/prefecture.rb'
require 'model/connection.rb'

get '/' do
  @kinds = [
    [:author, 'author'],
    [:visualized_sorting_algorithm, 'sorting'],
    [:multi_particles, 'particles'],
    [:field, 'field'],
    [:autonomous, 'autonomous'],
    [:sicp, 'sicp'],
    [:ruby, 'ruby'],
    [:visualized_list, 'list'],
    [:life, 'life'],
    [:graphics, 'graphics'],
    [:station, 'station'],
    [:lattice, 'lattice'],
    [:rails, 'rails'],
    [:twitter, 'twitter'],
  ]
  @navi = breadcrumb_list
  haml :index
end

get '/author' do
  @kinds = [
    [:name, 'Yuki Ushiba'],
    [:twitter, '@cowplace'],
    [:hobby, 'travel'],
    [:favorite, 'glass'],
    [:language, 'ruby'],
    [:interest, 'functional language']
  ]
  @navi = breadcrumb_list(:author)
  haml :author
end

get '/visualized_sorting_algorithm' do
  @kinds = [
    [:bu, 'bubble'],
    [:st, 'stone'],
    [:se, 'select'],
    [:in, 'insert'],
    [:he, 'heap'],
    [:qu, 'quick'],
    [:sh, 'shell'],
    [:co, 'comb'],
    [:me, 'merge(inplace)']
  ]
  @navi = breadcrumb_list(:visualized_sorting_algorithm)
  haml :sort
end

get '/multi_particles' do
  @kinds = %w(collisions collisions2 springs gravities expansion bubble delaunay)
  @navi = breadcrumb_list(:multi_particles)
  haml :multi_particles
end

get '/multi_particles/:kind' do |kind|
  @kinds = %w(collisions collisions2 springs gravities expansion bubble delaunay)
  if @kinds.include?(kind) then
    @kind = kind
    @navi = breadcrumb_list([:multi_particles, @kind])
    haml :multi_particles
  else
    redirect '/multi_particles'
  end
end

get '/field' do
  @kinds = %w(spring coordinate level energy)
  @navi = breadcrumb_list(:field)
  haml :field
end

get '/field/:kind' do |kind|
  @kinds = %w(spring coordinate level energy)
  if @kinds.include?(kind) then
    @kind = kind
    @navi = breadcrumb_list([:field, @kind])
    node_length = rand(90)+10
    graph = nil
    graph = Graph.new(node_length, rand(node_length/2) + node_length/2)
    graph.create_nodes
    if kind == 'level' then
      graph.create_tree_edges
    else
      if rand() > 0.5 then
        graph.create_random_edges
      else
        graph.create_tree_edges
      end
    end
    @nodes = graph.nodes
    @edges = graph.edges
    @brothers = graph.brothers
    haml :field
  else
    redirect '/field'
  end
end

get '/autonomous' do
  @navi = breadcrumb_list(:autonomous)
  haml :autonomous
end

get '/sicp' do
  @kinds = (1..46).map{|i| "1.#{i}.scm"}
  @navi = breadcrumb_list(:sicp)
  haml :sicp
end

get '/sicp/:kind' do |kind|
  @kinds = (1..46).map{|i| "1.#{i}.scm"}
  if @kinds.include?(kind) then
    @kind = kind
    @navi = breadcrumb_list([:sicp, @kind])
    @code = `cat views/sicp/#{@kind}`
    graph = SchemeParser.execute(@code)
    @nodes = graph.nodes
    @edges = graph.edges
    @brothers = graph.brothers
    haml :sicp
  else
    redirect '/sicp'
  end
end

get '/ruby' do
  @code = `cat model/prefecture.rb`
  @kinds = []
  @kind = 'hoge'
  graph = RubyTree.execute(@code)
  @nodes = graph.nodes
  @edges = graph.edges
  @brothers = graph.brothers
  haml :sicp
end

get '/visualized_list' do
  @kinds = get_list
  @navi = breadcrumb_list(:visualized_list)
  haml :list
end

get '/life' do
  @navi = breadcrumb_list(:life)
  haml :life
end

get '/graphics' do
  @kinds = %w(dragon)
  @navi = breadcrumb_list(:graphics)
  haml :graphics
end

get '/graphics/:kind' do |kind|
  @kinds = %w(dragon)
  if @kinds.include?(kind) then
    @kind = kind
    @navi = breadcrumb_list([:graphics, @kind])
    haml :graphics
  else
    redirect '/graphics'
  end
end

get '/station' do
  @kind = 'station'
  @kinds = Prefecture.all.map{|e| e.name}
  @stations = Station.normalized_all
  @navi = breadcrumb_list(:station)
  haml :station
end

get '/station/:prefecture' do |prefecture|
  @kind = 'station'
  @kinds = Prefecture.all.map{|e| e.name}
  pref = Prefecture.find(:name => prefecture)
  if !pref.nil? then
    @stations = Station.normalized_all(:pref_id => pref.id)
    @rails = Connection.normalized_all(:pref_id => pref.id)
    @navi = breadcrumb_list([:station, prefecture])
    haml :station
  else
    redirect '/station'
  end
end

get '/lattice' do
  @navi = breadcrumb_list(:lattice)
  @items = Item.get_items
  haml :lattice
end

get '/rails' do
  @navi = breadcrumb_list(:rails)
  haml :rails
end

get '/twitter' do
  @navi = breadcrumb_list(:twitter)
  @tweets = TwitterSeeker.execute
  haml :twitter
end

get '/top' do
  redirect '/'
end

get '/stylesheets/:stylesheet.css' do
  content_type "text/css", :charset => "UTF-8"
  sass :"sass/#{params[:stylesheet]}"
end

helpers do
  def title_with_name(title='something fun')
    return title + ' @cowplace'
  end

  def breadcrumb_list(routes=[])
    return (["/top"] + [routes]).flatten.map {|pos| link_to(pos,pos)}.join(escape_html(' > '))
  end

  def list2table(list)
    car = list.first
    if car.nil? then
      return 'NIL'
    elsif car.is_a?(Array) then
      return haml_template(
        'partial/list_to_table_if_tree',
        {
          :layout => false,
          :locals => {
            :car => list2table(car),
            :cdr => list2table(list[1..-1])
          }
        }
      )
    else
      return haml_template(
        'partial/list_to_table_if_serial',
        {
          :layout => false,
          :locals => {
            :car => car.inspect,
            :cdr => list2table(list[1..-1])
          }
        }
      )
    end
  end

  def get_list(depth=3)
    if depth > 0 then
      rnd = rand
      if rnd < 0.5 then
        return [get_list(depth-1), get_list(depth-1)]
      elsif rnd < 0.99 then
        return get_list(depth-1) + get_list(depth-1)
      end
    end
    return [0]
  end
end
