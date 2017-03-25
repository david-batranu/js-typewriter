(function(){
  function walkerFactory(rootElement) {
    return document.createTreeWalker(
      rootElement,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function(node){
          var content = node.nodeValue.trim().length;
          return content > 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        }
      }
    )
  };

  window.mkWalker = walkerFactory;

  function nodesFromWalker(walker) {
    var node, nodes = [];
    while(node = walker.nextNode()) { nodes.push(node); }
    return nodes;
  };

  var rootElement = document.querySelector('#source');
  var walker = walkerFactory(rootElement);

  var textNodes = nodesFromWalker(walker);

  function typewriterFactory(node) {
    var text = node.nodeValue;
    node.nodeValue = "";
    var typewriter = new Typewriter(node);
    return function(next_idx, all) {
      typewriter.setCompletionCallback(function(){
        var next_next = next_idx + 1;
        if (next_next <= all.length) {
          all[next_idx](next_idx+1, all);
        }
      });
      typewriter.typeText(text);
    }
  }

  var typeWriters = textNodes.map(typewriterFactory);
  typeWriters[0](1, typeWriters);
})();
