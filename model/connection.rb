Sequel::Model.plugin(:schema)
class Connection < Sequel::Model
  unless table_exists? then
    set_schema do
      foreign_key :line_id, :table => :lines
      foreign_key :from_id, :table => :stations
      foreign_key :to_id, :table => :stations
    end
    create_table
  end

  class << self
    def normalized_all(conf={})
      stations = Station.filter(conf)
      rails = Connection.graph(Station, {
        :id => :from_id
      }.merge(conf), {
        :table_alias => :from_s,
        :join_type => :inner
      }).graph(Station, {
        :id => :to_id
      }.merge(conf), {
        :table_alias => :to_s,
        :join_type => :inner,
        :implicit_qualifier => :connections
      })
      lat_min = stations.min(:lat)
      lat_max = stations.max(:lat)
      lon_min = stations.min(:lon)
      lon_max = stations.max(:lon)
      return rails.all.each do |rail|
        rail[:from_s].mod_pos(lat_min, lat_max, lon_min, lon_max)
        rail[:to_s].mod_pos(lat_min, lat_max, lon_min, lon_max)
      end
    end
  end
end
