var distances = require("./distance");

function KMeans(centroids) {
   this.centroids = centroids || [];
}

KMeans.prototype.randomCentroids = function(points, k) {
   var centroids = points.slice(0); // copy
   // randomly sorts input array
   centroids.sort(function() {
      return (Math.round(Math.random()) - 0.5);
   });
   // returns first k rows as random centroids
   return centroids.slice(0, k);
}

KMeans.prototype.classify = function(point, distance) {
   var min = Infinity,
       index = 0,
       point = this.simple_matrix ? point : point.value,
       curr_centroid;

   distance = distance || "euclidean";
   if (typeof distance == "string") {
      distance = distances[distance];
   }

   for (var i = 0; i < this.centroids.length; i++) {
      curr_centroid = this.simple_matrix ? this.centroids[i] : this.centroids[i].value;
      var dist = distance(point, curr_centroid);
      if (dist < min) {
         min = dist;
         index = i;
      }
   }

   return index;
}

KMeans.prototype.cluster = function(points, k, distance, snapshotPeriod, snapshotCb) {
   k = k || Math.max(2, Math.ceil(Math.sqrt(points.length / 2)));
   this.simple_matrix = points[0] instanceof Array;

   distance = distance || "euclidean";
   if (typeof distance == "string") {
      distance = distances[distance];
   }

   this.centroids = this.randomCentroids(points, k);

   var assignment = new Array(points.length);
   var clusters = new Array(k);

   var iterations = 0;
   var movement = true;
   while (movement) {
      // update point-to-centroid assignments
      for (var i = 0; i < points.length; i++) {
         assignment[i] = this.classify(points[i], distance);
      }

      // update location of each centroid
      movement = false;
      for (var j = 0; j < k; j++) {
         var assigned = [];
         for (var i = 0; i < assignment.length; i++) {
            if (assignment[i] == j) {
               assigned.push(points[i]);
            }
         }

         if (!assigned.length) {
            continue;
         }

         var centroid = this.centroids[j];
         var newCentroid = this.simple_matrix ? new Array(centroid.length) : { key: centroid.key, value: new Array(centroid.value.length) };

         var length = this.simple_matrix ? centroid.length : centroid.value.length;
         for (var g = 0; g < length; g++) {
            var sum = 0;
            for (var i = 0; i < assigned.length; i++) {
               var v = this.simple_matrix ? assigned[i][g] : assigned[i].value[g];
               sum += v;
            }
            
            if (this.simple_matrix) {
                newCentroid[g] = sum / assigned.length;
            } else {
                newCentroid.value[g] = sum / assigned.length;
            }

            if (this.simple_matrix && newCentroid[g] != centroid[g]) {
               movement = true;
            } else if (!this.simple_matrix && newCentroid.value[g] != centroid.value[g]) {
               movement = true;
            }
         }

         this.centroids[j] = newCentroid;
         clusters[j] = assigned;
      }

      if (snapshotCb && (iterations++ % snapshotPeriod == 0)) {
         snapshotCb(clusters);
      }
   }

   if (this.simple_matrix) {
       return clusters;
   } else {
       var result = [];
       for (var i = 0; i < clusters.length; i++) { 
         result[i] = clusters[i].map(function(d) { return d.key });
       }
       return result;
   }
}

KMeans.prototype.toJSON = function() {
   return JSON.stringify(this.centroids);
}

KMeans.prototype.fromJSON = function(json) {
   this.centroids = JSON.parse(json);
   return this;
}

module.exports = KMeans;

module.exports.kmeans = function(vectors, k) {
   return (new KMeans()).cluster(vectors, k);
}
