Sequel::Model.plugin(:schema)
class Prefecture < Sequel::Model
  unless table_exists? then
    set_schema do
      primary_key :id
      string :name
    end
    create_table
  end
end
