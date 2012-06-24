class Graph
  attr_accessor :nodes, :edges, :brothers
  def initialize(num_of_node,num_of_edge)
    @num_of_node = num_of_node
    @num_of_edge = num_of_edge
    @nodes = []
    @edges = []
    @brothers = []
  end

  def create_nodes
    @nodes = (0...@num_of_node).to_a
  end

  def create_random_edges
    @edges = (0...@num_of_edge).map{|e| @nodes.sample(2)}
  end

  def create_tree_edges
    adj_hash = hash_tree_edges
    @brothers = []
    adj_hash.values.find_all{|e| e.length > 1}.each do |ary|
      ary.each_with_index do |elem,idx|
        next if ary[idx+1].nil?
        @brothers << [elem, ary[idx+1]]
      end
    end
  end

  def hash_tree_edges
    @edges = (1...@num_of_node).map{|e| [(0...e).to_a.sample, e] }.sample(@num_of_edge)
    adj_hash = {}
    @edges.each do |pair|
      adj_hash[pair.first] = [] if adj_hash[pair.first].nil?
      adj_hash[pair.first] << pair.last
    end
    return adj_hash
  end

  def hash_dag_edges
    @edges = (1...@num_of_node).map{|e| [(0...e).to_a.sample, e] }.sample(@num_of_edge)
    extras = (1...@num_of_node).to_a.sample(10).map{|e| [(0...e).to_a.sample, e] }.sample(@num_of_edge)
    @edges += extras
    @edges.uniq!
    adj_hash = {}
    @edges.each do |pair|
      adj_hash[pair.first] = [] if adj_hash[pair.first].nil?
      adj_hash[pair.first] << pair.last
    end
    return adj_hash
  end
end
