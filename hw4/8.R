college<-read.csv("College.csv",header=T,na.strings ="?")
head(college)
rownames(college)<-college[,1]
fix(college)
college=college[,-1]
fix(college)
head(college)
summary(college)

pairs(~Apps+Accept+Enroll+Top10perc+Top25perc+F.Undergrad+P.Undergrad+Outstate+Room.Board,college)
pairs(college[,1:10])
head(college,10)
plot(college$Private, college$Outstate)
plot(college$Outstate, college$Private)
plot(Private,Outstate)

Elite=rep("No",nrow(college))
Elite[college$Top10perc >50]="Yes"
Elite=as.factor(Elite)
college=data.frame(college ,Elite)
summary(college$Elite)
plot(college$Elite, college$Outstate)

par(mfrow=c(2,2))
hist(Expend,breaks=50)
hist(Apps,col=2)
hist(Accept)
hist(Outstate)

head(college)
mean(Accept/Apps)
mean(Enroll/Accept)
plot(Top25perc,Grad.Rate)





