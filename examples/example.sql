CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(11) CHARACTER SET utf8mb4 DEFAULT NULL,
  `yn` tinyint(4) DEFAULT NULL,
  `score` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('1', 'test-1', '1', '9');
INSERT INTO `user` VALUES ('2', 'test0', '1', '16');
INSERT INTO `user` VALUES ('3', 'test1', '1', '15');
INSERT INTO `user` VALUES ('4', 'test2', '1', '7');
INSERT INTO `user` VALUES ('5', 'test3', '1', '6');
INSERT INTO `user` VALUES ('6', 'test4', '1', '11');
INSERT INTO `user` VALUES ('7', 'test5', '1', '6');
INSERT INTO `user` VALUES ('8', 'test6', '1', '8');
INSERT INTO `user` VALUES ('9', 'test7', '1', '0');

CREATE TABLE `user_hist` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(11) CHARACTER SET utf8 DEFAULT NULL,
  `yn` tinyint(4) DEFAULT NULL,
  `score` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of user_hist
-- ----------------------------
INSERT INTO `user_hist` VALUES ('1', 'hist_1', '1', '10');
INSERT INTO `user_hist` VALUES ('2', 'hist_2', '1', '16');
INSERT INTO `user_hist` VALUES ('3', 'hist_3', '1', '9');
INSERT INTO `user_hist` VALUES ('4', 'hist_4', '1', '11');
INSERT INTO `user_hist` VALUES ('5', 'hist_5', '1', '7');