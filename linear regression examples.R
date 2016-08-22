ad<-read.csv("Advertising.csv") #Read in Advertising data set
ad$X<-NULL                      #Delete leading column of row numbers
pairs(ad)                       #Make scatter plot of all possible pairs of columns
cor(ad)                         # pairwise correlation between variables
slmTV<-lm(ad$Sales~ad$TV)       #Simple linear regression of Sales on TV
slmRadio<-lm(ad$Sales~ad$Radio) #SLR of Sales on Radio  
slmNews<-lm(ad$Sales~ad$Newspaper) #SLR of Sales on Newspaper
summary(slmTV)                  #Summary of model fit-- also check other simple models
mlr<-lm(ad$Sales~ad$TV+ad$Radio+ad$Newspaper) # Full multiple regression model
summary(mlr)                    #Summary of model fit for multiple regression model
newmlr<-lm(ad$Sales~ad$TV+ad$Radio)# New model with Newspaper removed
