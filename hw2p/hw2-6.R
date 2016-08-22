#hw2-6
samp<-rnorm(10,50,9)
s_samp<-sqrt(sum((samp-mean(samp))^2)/(10-1))#sqrt((Xi-x)^2/n-1)
sex_samp<-s_samp/sqrt(10)
mean(samp)-1.96*sex_samp    #41.55-51.42
mean(samp)+1.96*sex_samp
t.test(samp)$conf.int       #40.79-52.18

samp100<-rnorm(100,50,9)
s_samp100<-sqrt(sum((samp100-mean(samp100))^2)/(100-1))#sqrt((Xi-x)^2/n-1)
sex_samp100<-s_samp100/sqrt(100)
mean(samp100)-1.96*sex_samp100    #46.32
mean(samp100)+1.96*sex_samp100    #49.82
#the mean will 95% in the interval
t.test(samp100)$conf.int     #46.30-49.84