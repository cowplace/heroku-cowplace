require 'rubygems'
require 'haml'
require 'sass'
require 'sinatra'
require 'sinatra_more/markup_plugin'
require 'sinatra_more/render_plugin'
Sinatra::Base.register SinatraMore::MarkupPlugin
Sinatra::Base.register SinatraMore::RenderPlugin

require 'fastercsv'

require 'graphviz'

get '/' do
  @kinds = [
    [:author, 'author'],
    [:visualized_sorting_algorithm, 'sorting'],
    [:multi_particles, 'particles'],
    [:visualized_list, 'list'],
    [:visualized_structure, 'structure'],
    [:life, 'life'],
    [:graphics, 'graphics'],
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
  @kinds = %w(collisions springs gravities expansion bubble)
  @navi = breadcrumb_list(:multi_particles)
  haml :multi_particles
end

get '/multi_particles/:kind' do |kind|
  @kinds = %w(collisions springs gravities expansion bubble)
  if @kinds.include?(kind) then
    @kind = kind
    @navi = breadcrumb_list([:multi_particles, @kind])
    haml :multi_particles
  else
    redirect '/multi_particles'
  end
end

get '/visualized_list' do
  @kinds = list_sample
  @navi = breadcrumb_list(:visualized_list)
  haml :list
end

get '/visualized_structure' do
  @kinds = graphviz_sample
  @navi = breadcrumb_list(:visualized_structure)
  haml :structure
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
  @kind = 'yamanote'
  @kinds = get_stations
  @navi = breadcrumb_list(:station)
  haml :station
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
    return ([:top] + [routes]).flatten.map {|pos| link_to(pos,pos)}.join(escape_html(' > '))
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

  def list_sample(depth=3)
    if depth > 0 then
      rnd = rand
      if rnd < 0.5 then
        return [list_sample(depth-1), list_sample(depth-1)]
      elsif rnd < 0.99 then
        return list_sample(depth-1) + list_sample(depth-1)
      end
    end
    return [0]
  end

  def graphviz_sample
    g = GraphViz.new('G')

    main        = g.add_node( "main" )
    parse       = g.add_node( "parse" )
    execute     = g.add_node( "execute" )
    init        = g.add_node( "init" )
    cleanup     = g.add_node( "cleanup" )
    make_string = g.add_node( "make_string" )
    printf      = g.add_node( "printf" )
    compare     = g.add_node( "compare" )

    g.add_edge(main, parse )
    g.add_edge(parse, execute )
    g.add_edge(main, init )
    g.add_edge(main, cleanup )
    g.add_edge(execute, make_string )
    g.add_edge(execute, printf )
    g.add_edge(init, make_string )
    g.add_edge(main, printf )
    g.add_edge(execute, compare )

    return g.output(:none => String).gsub("\n", ';').gsub(';;', ';').gsub('{;', '{').gsub(' ', '').gsub('digraphG', 'digraph')
  end

  def get_stations
    stations = []
    FasterCSV.foreach('m_station.utf8.csv') do |row|
      stations << Station.new(row)
    end

    lat_min = stations.map{|s| s.lat}.min
    lat_max = stations.map{|s| s.lat}.max
    lon_min = stations.map{|s| s.lon}.min
    lon_max = stations.map{|s| s.lon}.max

    stations.each{|s| s.mod_pos(lat_min, lat_max, lon_min, lon_max)}
    return stations
  end
end

class Station
  attr_accessor :lat, :lon, :name
  def initialize(row)
    @lat  = row[-2].to_f
    @lon  = row[-3].to_f
    @name = row[-5]
  end

  def mod_pos(lat_min, lat_max, lon_min, lon_max)
    @lat = (lat_max-@lat) / (lat_max-lat_min) * 380 + 10
    @lon = (@lon-lon_min) / (lon_max-lon_min) * 380 + 10
  end
end
