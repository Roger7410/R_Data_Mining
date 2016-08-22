#a.
x = matrix(rnorm(20*3*50, mean=0, sd=0.001), ncol=50)
x[1:20, 2] = 1
x[21:40, 1] = 10
x[21:40, 2] = 10
x[41:60, 1] = 1
#b
pca_result=prcomp(x)
summary(pca_result)
pca_result$x[,1:2]
plot(pca_result$x[,1:2], col=1:3)
#c
km_result = kmeans(x, 3, nstart=20)
km_result
table(km_result$cluster, c(rep(1,20), rep(2,20), rep(3,20)))
#d
km_result = kmeans(x, 2, nstart=20)
table(km_result$cluster, c(rep(1,20), rep(2,20), rep(3,20)))
#E
km_result = kmeans(x, 4, nstart=20)
table(km_result$cluster, c(rep(1,20), rep(2,20), rep(3,20)))
#f
km_result = kmeans(pca.out$x[,1:2], 3, nstart=20)
table(km_result$cluster, c(rep(1,20), rep(2,20), rep(3,20)))
#g
km_result = kmeans(scale(x), 3, nstart=20)
table(km_result$cluster, c(rep(1,20), rep(2,20), rep(3,20)))
