require 'rubygems'
require 'haml'
require 'sass'
require 'json'
require 'sinatra'
require 'sinatra_more/markup_plugin'
require 'sinatra_more/render_plugin'
require 'fastercsv'
require 'sequel'

require './lib/item.rb'
require './lib/graph.rb'
require './lib/schemeparser.rb'
require './lib/rubyparser.rb'
require './lib/twitterseeker.rb'
require './lib/railway.rb'
require './app'

run Sinatra::Application
