#a
library(ISLR)
attach(OJ)
set.seed(1)
head(OJ)
dim(OJ)
train = sample(dim(OJ)[1],800)
OJ_train = OJ[train,]
OJ_test  = OJ[-train,]

#b
library(tree)
library(tree)
#where is the Buy?
oj_tree = tree(Purchase~.,data=OJ_train)
summary(oj_tree)

#c
oj_tree

#d
plot(oj_tree)

#e
oj_pred = predict(oj_tree, OJ_test, type = "class")
table(OJ_test$Purchase, oj_pred)

#f
cv_oj = cv.tree(oj_tree, FUN = prune.tree)

#g
plot(cv_oj$size, cv_oj$dev, type = "b", xlab = "tree size", ylab = "error rate")

#i
oj_pruned = prune.tree(oj_tree, best = 6)

#j
summary(oj_pruned)

#k
pred_unpruned = predict(oj_tree, OJ_test, type = "class")
misclass_unpruned = sum(OJ_test$Purchase != pred_unpruned)
misclass_unpruned/length(pred_unpruned)

pred_pruned = predict(oj_pruned, OJ_test, type = "class")
misclass_pruned = sum(OJ_test$Purchase != pred_pruned)
misclass_pruned/length(pred_pruned)
