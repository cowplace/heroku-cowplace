Sinatra::Base.register SinatraMore::MarkupPlugin
Sinatra::Base.register SinatraMore::RenderPlugin

#Sequel.connect(ENV['DATABASE_URL'] || 'sqlite://batch/lines.db')
#require './model/station.rb'
#require './model/prefecture.rb'
#require './model/connection.rb'

get '/stylesheets/:stylesheet.css' do
  content_type "text/css", :charset => "UTF-8"
  sass :"sass/#{params[:stylesheet]}"
end

get '/' do
  @kinds = categories
  @navi = breadcrumb_list
  haml :index
end

get '/api/tree.json' do
  content_type :json, :charset => 'utf-8'
  node_length = rand(90)+10
  graph = nil
  graph = Graph.new(node_length, node_length)
  graph.create_nodes
  graph.hash_tree_edges.to_json
end

get '/api/dag.json' do
  content_type :json, :charset => 'utf-8'
  node_length = rand(90)+10
  graph = nil
  graph = Graph.new(node_length, node_length)
  graph.create_nodes
  graph.hash_dag_edges.to_json
end

get '/api/railway/tokyo.lines.json' do
  content_type :json, :charset => 'utf-8'
  Railway::Lines.tokyo.to_hash.to_json
end

get '/api/railway/tokyo.stations.json' do
  content_type :json, :charset => 'utf-8'
  Railway::Station.tokyo.map(&:to_hash).to_json
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

get '/twitter' do
  @navi = breadcrumb_list(:twitter)
  @tweets = TwitterSeeker.execute
  haml :twitter
end

get '/qsp' do
  @navi = breadcrumb_list(:qsp)
  @nodes = (1..500).to_a
  haml :qsp
end

get '/top' do
  redirect '/'
end

get '/:category' do |category|
  if categories.map{|page| page.first.to_s}.include?(category) then
    @kinds = pages(category.to_sym)
    @navi = breadcrumb_list(category)
    haml category.to_sym
  else
    return not_found
  end
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

get '/field/:kind' do |kind|
  @kinds = %w(spring coordinate level energy fence)
  if @kinds.include?(kind) then
    @kind = kind
    @navi = breadcrumb_list([:field, @kind])
    node_length = rand(90)+10
    graph = nil
    graph = Graph.new(node_length, rand(node_length/2) + node_length/2)
    graph.create_nodes
    if %w(level fence).include?(kind) then
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

get '/:category/:page' do |category, page|
  if categories.map{|page| page.first.to_s}.include?(category) then
    @kinds = pages(category.to_sym)
    if @kinds.include?(page) then
      @kind = page
      @navi = breadcrumb_list([category, page])
      haml category.to_sym
    else
      redirect category.to_sym
    end
  else
    return not_found
  end
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

  def categories
    return [
      [:author, 'author'],
      [:sort, 'sorting'],
      [:multi_particles, 'particles'],
      [:field, 'field'],
      [:multi_layers, 'multi_layers'],
      [:autonomous, 'autonomous'],
      [:sicp, 'sicp'],
      [:ruby, 'ruby'],
      [:list, 'list'],
      [:circuit, 'circuit'],
      [:maze, 'maze'],
      [:punipuni, 'punipuni'],
      [:life, 'life'],
      [:graphics, 'graphics'],
      [:music, 'sound'],
      [:miniature, 'miniature'],
#      [:station, 'station'],
      [:lattice, 'lattice'],
      [:rails, 'rails'],
      [:railway, 'railway'],
#      [:twitter, 'twitter'],
      [:qsp, 'qsp']
    ]
  end

  def pages(category)
    return {
      :author => [
                   [:name, 'Yuki Ushiba'],
                   [:twitter, '@cowplace'],
                   [:hobby, 'travel'],
                   [:favorite, 'glass'],
                   [:language, 'ruby'],
                   [:interest, 'functional language']
                 ],
      :sort => [
                 [:bu, 'bubble'],
                 [:st, 'stone'],
                 [:se, 'select'],
                 [:in, 'insert'],
                 [:he, 'heap'],
                 [:qu, 'quick'],
                 [:sh, 'shell'],
                 [:co, 'comb'],
                 [:me, 'merge(inplace)']
               ],
      :multi_particles => %w(collisions collisions2 springs gravities expansion bubble delaunay),
      :field => %w(spring coordinate level energy fence),
      :multi_layers => %w(multi_layers_base hexagons cubes life),
      :autonomous => %w(base boids),
      :sicp => (1..46).map{|i| "1.#{i}.scm"},
      :ruby => 'ruby',
      :list => get_list(rand(5)+2),
      :circuit => %w(circuit_base),
      :maze => 'maze',
      :punipuni => %w(puyodot softy),
      :life => 'life',
      :graphics => %w(dragon),
      :music => 'sound',
      :miniature => 'miniature',
#      :station => 'station',
      :lattice => 'lattice',
      :rails => 'rails',
      :railway => 'railway',
#      :twitter => 'twitter',
      :qsp => 'qsp'
    }[category]
  end
end
