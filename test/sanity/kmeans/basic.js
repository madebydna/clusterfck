var clusterfck = require("../../../lib/clusterfck"),
    equality = require("equality");

var data = [
   [1, 1, 1],
   [2, 2, 2],
   [3, 3, 3],
   [4, 4, 4],
   [5, 5, 5],
   [20, 20, 20],
   [200, 200, 200]
];


var data_with_objects = [
    {key: 'a', value: [1, 1, 1]},
    {key: 'b', value: [2, 2, 2]},
    {key: 'c', value: [3, 3, 3]},
    {key: 'd', value: [4, 4, 4]},
    {key: 'e', value: [5, 5, 5]},
    {key: 'f', value: [20, 20, 20]},
    {key: 'g', value: [200, 200, 200]}
];

var iterations = 20;

exports.testTwoClusters = function(test) {
   for (var i = 0; i < iterations; i++) {
      var clusters = clusterfck.kmeans(data, 2);
      test.ok(equality.members(clusters, [
         [ 
            [1, 1, 1],
            [2, 2, 2],
            [3, 3, 3],
            [4, 4, 4],
            [5, 5, 5],
            [20, 20, 20]
         ],
         [
            [200, 200, 200]
         ]
      ]), "clustered into correct two clusters");
   }
   test.done(); 
}

exports.testThreeClusters = function(test) {
   for (var i = 0; i < iterations; i++) {
      var clusters = clusterfck.kmeans(data, 3);
      test.ok(equality.members(clusters, [
         [ 
            [1, 1, 1],
            [2, 2, 2],
            [3, 3, 3],
            [4, 4, 4],
            [5, 5, 5],
         ],
         [
            [20, 20, 20]
         ],
         [
            [200, 200, 200]
         ]
      ]), "clustered into correct three clusters");
   }
   test.done(); 
}

exports.testTwoClustersWithObjectData = function(test) {
   for (var i = 0; i < iterations; i++) {
      var clusters = clusterfck.kmeans(data_with_objects, 2);
      test.ok(equality.members(clusters, [
         [ 'a', 'b', 'c', 'd', 'e', 'f' ],
         [ 'g' ]
      ]), "clustered into correct two clusters");
   }
   test.done(); 
}

