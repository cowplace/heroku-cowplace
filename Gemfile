source :rubygems

gem 'haml'
gem 'sass'
gem 'json'
gem 'sinatra'
gem 'sinatra_more'
gem 'fastercsv'
gem 'sequel'
gem 'nokogiri'
gem 'ruby_parser'
gem 'twitter'
gem 'sqlite3'

local_gemfile = File.join(File.dirname(__FILE__), "Gemfile.local")
if File.exists?(local_gemfile)
  puts "Loading Gemfile.local ..." if $DEBUG # `ruby -d` or `bundle -v`
  instance_eval File.read(local_gemfile)
end
