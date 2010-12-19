require 'zipruby'
require 'stringio'

module OpenZip
  def open2(zipstream, target, *rest, &block)
    zip_in_zip = nil
    if %r{\.zip/} =~ target and $' then
      zip_in_zip = "#{$`}.zip"
      target = $'
    end
    
    Zip::Archive.open_buffer(zipstream){|arc|
      arc.each{|file|
        if zip_in_zip and file.name == zip_in_zip then
          return open2(file.read, target, *rest, &block) # recursive
        elsif file.name == target
          if block
            return block.call(file)
          else
            return StringIO::new(file.read)
          end
        end
      }
      raise RuntimeError::new("File not found")
    }
  end
  
  def open(zipstream, target, *rest, &block)
    # mode check
    mode = rest[0]
    unless mode == nil ||
           mode == 'r' || mode == 'rb' ||
           mode == File::RDONLY then
      raise ArgumentError.new("invalid access mode #{mode} (#{:OpenZip} resource is read only.)")
    end
    
    return open2(zipstream, target, *rest, &block)
  end
  
  module_function :open, :open2
end

module Kernel
  private
  alias open_zip_original_open open # :nodoc:

  # makes possible to open various resources including Zip file.
  # If the first argument respond to `open' method,
  # the method is called with the rest arguments.
  #
  # If the first argument is a string which includes .zip/,
  # OpenZip::open is called with the appropriate arguments.
  #
  # Otherwise original open is called.
  def open(name, *rest, &block) # :doc:
    if name.respond_to?(:open)
      name.open(*rest, &block)
    elsif name.respond_to?(:to_str) \
        && %r{\.zip/} =~ name then
      OpenZip::open( \
          open_zip_original_open("#{$`}.zip").read, $', *rest, &block)
    else
      open_zip_original_open(name, *rest, &block)
    end
  end
  module_function :open
end

if $0 == __FILE__ then

path = ARGV.shift
puts "Path: #{path}"
p open(path).read
open(path){|f|
  puts "Name: #{f.name}"
  p f.read
}
  
end