require 'rubygems'
require 'haml'
require 'sass'
require 'sinatra'
require 'sinatra_more/markup_plugin'
require 'sinatra_more/render_plugin'
Sinatra::Base.register SinatraMore::MarkupPlugin
Sinatra::Base.register SinatraMore::RenderPlugin

get '/' do
  haml :index
end

get '/profile' do
  @kinds = [
    [:name, 'Yuki Ushiba'],
    [:twitter, '@cowplace'],
    [:hobby, 'travel'],
    [:favorite, 'glass'],
    [:language, 'ruby'],
    [:interest, 'functional language']
  ]
  haml :profile
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
  haml :sort
end

get '/multi_particles' do
  @kinds = %w(springs gravities)
  haml :multi_particles
end

get '/visualized_list' do
  @kinds = (1..3).map do |i|
    (0..(rand(3)-i+1)).map do |j|
      (0..j).to_a
    end
  end
  haml :list
end

get '/top' do
  haml :index
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
    return routes.map {|pos| link_to(pos,pos)}.join(escape_html(' > '))
  end

  def list2table(list)
    car = list.first
    if car.nil? then
      return '*'
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
end
