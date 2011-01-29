require 'open-uri'
require 'rexml/document'

class Item
  attr_accessor :name, :img, :url
  def initialize(item)
    @name = item.elements['title'].text
    @img = item.elements['mediumImageUrl'].text
    @url = item.elements['affiliateUrl'].text
  end

  class << self
    def get_items
      items = []
      xml = REXML::Document.new(open('http://api.rakuten.co.jp/rws/3.0/rest?developerId=c9e2d430e9844443674e9cc80c63845a&affiliateId=0d65000a.224c5bad.0d65000b.0995e2dd&operation=BooksBookSearch&version=2011-01-27&publisherName=%e3%82%aa%e3%83%a9%e3%82%a4%e3%83%aa%e3%83%bc&sort=sales').read)
      xml.elements.each('//Items/Item') do |item|
        items << Item.new(item)
      end
      return items
    end
  end
end
