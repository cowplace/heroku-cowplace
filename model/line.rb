Sequel::Model.plugin(:schema)
class Line < Sequel::Model
  unless table_exists? then
    set_schema do
      primary_key :id
      string :name
      string :company_name
      integer :type
    end
    create_table
  end
end
