set.seed(2)
newiris<-iris
head(newiris)
newiris$Species<-NULL
km.out<-kmeans(df,3,nstart=20)
table(iris$Species,km.out$cluster)
#
set.seed(1)
samp<-sample(1:150, 40)
smalliris<-newiris[samp,]
dist<-dist(smalliris)
hc.comp<-hclust(dist(smalliris),method="complete")
plot(hc.comp,hang=-1,labels=iris$Species[samp])
groups<-cutree(hc.comp,k=3)
table(clusters=groups,true=iris$Species[samp])

set.seed(1)
samp<-sample(1:150, 40)
smalliris<-newiris[samp,]
dist<-dist(smalliris)
hc.comp<-hclust(dist(smalliris),method="average")
plot(hc.comp,hang=-1,labels=iris$Species[samp])
groups<-cutree(hc.comp,k=3)
table(clusters=groups,true=iris$Species[samp])

set.seed(1)
samp<-sample(1:150, 40)
smalliris<-newiris[samp,]
dist<-dist(smalliris)
hc.comp<-hclust(dist(smalliris),method="single")
plot(hc.comp,hang=-1,labels=iris$Species[samp])
groups<-cutree(hc.comp,k=3)
table(clusters=groups,true=iris$Species[samp])

