library(ISLR)
attach(Carseats)
High=ifelse(Sales <=8,"No","Yes")
Carseats =data.frame(Carseats ,High)
head(Carseats)
summary(Carseats)
train = sample(nrow(Carseats), 2/3 * nrow(Carseats))
test = -train
#logistic regression
glm.fit = glm(High ~ .-Sales , data = Carseats[train, ], family = "binomial")
glm.probs = predict(glm.fit, newdata = Carseats[test, ], type = "response")
glm.pred = rep("No", length(glm.probs))
glm.pred[glm.probs > 0.5] = "Yes"
table(glm.pred, Carseats$High[test])
mean(glm.pred != Carseats$High[test])
#0.12

#Boosting
library(gbm)
Carseats$BinomialHigh = ifelse(Carseats$High == "Yes", 1, 0)
boost.carseats = gbm(BinomialHigh ~ . - Sales - High, data = Carseats[train,], distribution = "bernoulli", n.trees = 5000)
result.boost = predict(boost.carseats, newdata = Carseats[test, ], n.trees = 5000)
result.pred = rep(0, length(result.boost))
result.pred[result.boost > 0.5] = 1
table(result.pred, Carseats$BinomialHigh[test])
mean(result.pred != Carseats$BinomialHigh[test])
#0.18

#Bagging
Carseats = Carseats[, !(names(Carseats) %in% c("BinomialHigh"))]
library(randomForest)
bag.carseats = randomForest(High ~ . - Sales, data = Carseats, subset = train)
result.bag = predict(bag.carseats, newdata = Carseats[test, ])
table(result.bag, Carseats$High[test])
mean(result.bag != Carseats$High[test])
#0.17

#Random forest
rf.carseats = randomForest(High ~ . - Sales, data = Carseats, subset = train)
result.bag = predict(rf.carseats, newdata = Carseats[test, ])
table(result.bag, Carseats$High[test])
mean(result.bag != Carseats$High[test])
#0.19

#logistic regression get the lowest validation set test error rate.