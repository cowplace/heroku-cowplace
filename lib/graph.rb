class Graph
  attr_accessor :nodes, :edges
  def initialize(num_of_node,num_of_edge)
    @num_of_node = num_of_node
    @num_of_edge = num_of_edge
  end

  def create_nodes
    @nodes = (0...@num_of_node).to_a
  end

  def create_random_edges
    @edges = (0...@num_of_edge).map{|e| @nodes.sample(2)}
  end

  def create_tree_edges
    @edges = (1...@num_of_node).map{|e| [(0...e).to_a.sample(1), e] }
  end
end
