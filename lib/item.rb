require 'open-uri'
require 'nokogiri'

class Item
  attr_accessor :name, :img, :url
  def initialize(item)
    @name = item.at('title').inner_html
    @img = item.at('mediumImageUrl').inner_html
    @url = item.at('affiliateUrl').inner_html
  end

  class << self
    def get_items
      items = []
      urls = []
      %w(-releaseDate).each do |method|
        (1..3).each do |idx|
          urls << "http://api.rakuten.co.jp/rws/3.0/rest?developerId=c9e2d430e9844443674e9cc80c63845a&affiliateId=0d65000a.224c5bad.0d65000b.0995e2dd&operation=BooksBookSearch&version=2011-01-27&publisherName=%e3%82%aa%e3%83%a9%e3%82%a4%e3%83%aa%e3%83%bc&page=#{idx}&sort=#{method}"
        end
      end
      urls.each do |url|
        xml = Nokogiri::XML(open(url))
        xml.xpath('//Item').each do |item|
          STDERR.puts item
          items << Item.new(item)
        end
      end
      return items
    end
  end
end
