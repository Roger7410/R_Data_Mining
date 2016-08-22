intercept_set<-rep(NA,1000)
x_set<-rep(NA,1000)
for(i in 1:1000){
  set.seed(12)
  x<-seq(3,7,.02)
  r<-rnorm(201,mean=0,sd=2)
  y<-2+4.6*x+r
  out<-lm(y~x)
  intercept_set[i]<-coef(out)["(Intercept)"]
  x_set[i]<-coef(out)["x"]
}
df<-data.frame(inter=intercept_set,x=x_set)



