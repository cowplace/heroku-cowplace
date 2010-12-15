class Station
  attr_accessor :lat, :lon, :name
  def initialize(row)
    @lat  = row[-2].to_f
    @lon  = row[-3].to_f
    @pref_code = row[-4].to_i
    @name = row[-5]
  end

  def mod_pos(lat_min, lat_max, lon_min, lon_max)
    delta = 800
    d_lat = lat_max - lat_min
    d_lon = lon_max - lon_min
    if d_lat > d_lon then
      delta = d_lat
    else
      delta = d_lon
    end
    @lat = (lat_max-@lat) / delta * 780 + 10
    @lon = (@lon-lon_min) / delta * 780 + 10
  end

  def target_pref?(pref_code)
    return @pref_code == pref_code || pref_code == :all
  end

  class << self
    def get_stations(pref_code=:all)
      stations = []
      FasterCSV.foreach('m_station.utf8.csv') do |row|
        station = Station.new(row)
        stations << station if station.target_pref?(pref_code)
      end

      lat_min = stations.map{|s| s.lat}.min
      lat_max = stations.map{|s| s.lat}.max
      lon_min = stations.map{|s| s.lon}.min
      lon_max = stations.map{|s| s.lon}.max

      stations.each{|s| s.mod_pos(lat_min, lat_max, lon_min, lon_max)}
      return stations
    end
  end
end

class Prefectures
  @@list = %w(
    Hokkaido
    Aomori
    Iwate
    Miyagi
    Akita
    Yamagata
    Fukushima
    Ibaraki
    Tochigi
    Gunma
    Saitama
    Chiba
    Tokyo
    Kanagawa
    Niigata
    Toyama
    Ishikawa
    Fukui
    Yamanashi
    Nagano
    Gifu
    Shizuoka
    Aichi
    Mie
    Shiga
    Kyoto
    Osaka
    Hyogo
    Nara
    Wakayama
    Tottori
    Shimane
    Okayama
    Hiroshima
    Yamaguchi
    Tokushima
    Kagawa
    Ehime
    Kochi
    Fukuoka
    Saga
    Nagasaki
    Kumamoto
    Oita
    Miyazaki
    Kagoshima
    Okinawa
  )
  class << self
    def get_list
      return @@list
    end

    def get_no(name)
      return @@list.index(name) + 1
    end
  end
end