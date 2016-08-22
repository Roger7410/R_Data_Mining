#hw2-4a
means9<-rep(NA,1000)
for (i in 1:1000){
  samp9<-rnorm(9,50,12) 
  means9[i]<-mean(samp9)
}
left9<-means9-1.96*12/3
right9<-means9+1.96*12/3
df<-data.frame(l.end=left9,r.end=right9)
head(df)
summary(df)
#hw2-4b
percentage<-sum(df$l.end<50 & df$r.end>50)/1000 #%95
