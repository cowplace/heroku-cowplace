Sequel::Model.plugin(:schema)
class Station < Sequel::Model
  unless table_exists? then
    set_schema do
      primary_key :id
      string :name
      integer :pref_id
      float :lon
      float :lat
    end
    create_table
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
    self.lat = (lat_max-self.lat) / delta * 780 + 10
    self.lon = (self.lon-lon_min) / delta * 780 + 10
  end

  class << self
    def normalized_all(conf = {})
      elems = Station.filter(conf).all
      lat_range = elems.map{|e| e.lat}.minmax
      lon_range = elems.map{|e| e.lon}.minmax
      return elems.each{|e| e.mod_pos(lat_range.first, lat_range.last, lon_range.first, lon_range.last)}
    end
  end
end
