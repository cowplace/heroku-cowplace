# -*- coding : UTF-8 -*-
require 'ruby_parser'

class RubyTree
  attr_accessor :nodes, :edges, :brothers
  def initialize(ary)
    @nodes = ['■']
    @edges = []
    @brothers = []
    traverse(ary.compact, 0)
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
      traverse(elem.compact, child_no) if elem.is_a?(Array)
    end
  end
  class << self
    def execute(code)
      RubyTree.new(RubyParser.new.parse(code))
    end
  end
end
