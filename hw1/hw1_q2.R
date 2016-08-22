#at least two people sharing the same birthday
f.two<-function(x){
  if(x==1) 0 #if only 1 person, 0
  else{      #if more than 2, p = 1-all in different days
    diff<-1
    for(i in 1:x){
      diff<-diff*(365-i+1)/365
    }
    1-diff
  }
}
f.two(2)
f.two(10)
f.two(40)

#a plot for 1-365
results<-vector(mode="integer",length=365)
results[1]<-0
for(i in 2:365){
  results[i]<-f.two(i)
}
plot(results)
