class SchemeParser
  attr_accessor :nodes, :edges, :brothers
  def initialize(ary)
    @nodes = ['■']
    @edges = []
    @brothers = []
    traverse(ary, 0)
  end

  def traverse(ary, parent)
    base = @nodes.length-1
    @nodes +=  ary.map do |elem|
      if elem.is_a?(Array) then
        car = elem.first
        if car.is_a?(Array) || car.is_a?(Numeric) then
          '■'
        else
          elem.shift
        end
      else
        elem
      end
    end
    ary.each_with_index do |elem, idx|
      child_no = base+idx+1
      @edges << [parent, child_no] if parent != child_no
      @brothers << [child_no, child_no+1] unless ary[idx+1].nil?
      traverse(elem, child_no) if elem.is_a?(Array)
    end
  end

  class << self
    class Sexp < String
      def to_sexp
        array = SArray.new(self.chomp.split(/([()])| |\n|\t/).delete_if{|c| c.size == 0})
        return array if array.empty?
        if array[-1] != ')' then
          STDERR.puts array.inspect
          raise "The expression doesn't close." if array[-1] != ')'
        end
        return array.parse_sexp
      end
    end

    class SArray < Array
      def parse_sexp
        q = []
        q << '['
        self.each do |l|
          case l
          when '('
            q << '['
          when ')'
            q << '],'
          else
            q << '"' + l.gsub('"','\"') + '",'
          end
        end
        q << ']'
        return eval(q.join.gsub(',]',']'))
      end
    end

    def execute(sexp)
      SchemeParser.new(Sexp.new(sexp.gsub(/;.*/,'')).to_sexp)
    end
  end
end
