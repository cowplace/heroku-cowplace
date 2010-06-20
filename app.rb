require 'rubygems'
require 'haml'
require 'sass'
require 'sinatra'
require 'sinatra_more/markup_plugin'
Sinatra::Base.register SinatraMore::MarkupPlugin

get '/' do
  haml :index
end

get '/stylesheets/:stylesheet.css' do
  content_type "text/css", :charset => "UTF-8"
  sass :"sass/#{params[:stylesheet]}"
end

helpers do
  def write_title
    title = (@title || 'something fun') + ' @cowplace'
  end
end
