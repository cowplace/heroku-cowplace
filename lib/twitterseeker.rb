require 'twitter'

class TwitterSeeker
  @@regexp = Regexp.new('http://[^\s]*')
  @@domains = [
#    'item.rakuten.co.jp',
#    'amazon.co.jp',
    'cookpad.com'
  ]
  def seek(domain)
    return Twitter::Search.new.containing(domain).fetch
  end

  def format(tweet)
    url = @@regexp.match(tweet.text)
    return {
      :tweet => tweet.text,
      :url => url,
      :img_src => "http://capture.heartrails.com/?#{url}"
    }
  end

  class <<self
    def execute
      seeker = TwitterSeeker.new
      tweets = {}
      @@domains.each do |domain|
        tweets[domain] = seeker.seek(domain).map do |tweet|
          seeker.format(tweet)
        end
      end
      return tweets
    end
  end
end
