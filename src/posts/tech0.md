---
title: House pricing prediction
descriptions: 
  - Data cleaning and preprocessing on categorical and numerical variables
  - Creation of new features (e.g., TotalArea, TotalBaths, binary flags for fireplaces, pools, etc.)
  - Handling of missing values using neighborhood-specific imputation or default values
  - Box-Cox transformation and RobustScaler used to normalize skewed distributions
  - Feature selection based on correlation matrix and XGBoost feature importance
  - Training of several regression models (Ridge, Lasso, SVR, Gradient Boosting, XGBoost, and LightGBM)
  - Hyperparameter tuning using GridSearchCV and RandomizedSearchCV
  - Implementation of model stacking with Ridge as the meta-model to combine base model predictions
  - Final evaluation using RMSLE on Kaggle with a top 0.8% leaderboard ranking
github: https://github.com/Totom38/house-pricing
image: /static/img/tech/0.png
author: Tom Gilgenkrantz
date: 2025-03-13
tags:
  - left
  - center
  - right
  - tech
---