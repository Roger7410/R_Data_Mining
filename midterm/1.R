set.seed(12)
x<-rnorm(100,mean=10,sd=1)
y<-rnorm(100,mean=10,sd=1)
df<-data.frame(x=x,y=y)
df

t.test(x,y,mu=0)
t.test(x-y,mu=0)


fit <- lm(y ~ x, data = df)
summary(fit)
par(mfrow=c(2,2))
plot(fit)

x<-rnorm(100,mean=0,sd=1)
y<-rnorm(100,mean=0,sd=1)
dff<-data.frame(x=x,y=y)
df<-rbind(df,dff)
df
fit <- lm(y ~ x, data = df)
summary(fit)
plot(fit)
