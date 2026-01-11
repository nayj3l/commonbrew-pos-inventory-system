-- First, add all ingredients
INSERT INTO ingredient (id, name, unit) VALUES
 (1,'Milk','ml'), (2,'Espresso Beans','g'), (3,'Frappe Base','g'),
 (4,'Creamer','g'), (5,'Sweetener','g'), (10,'Powder: Chocolate','g'),
 (30,'Syrup: Brown Sugar','ml'), (90,'Cup - Regular','pcs'), (91,'Ice','g'),
 (92,'Cup - Upsize','pcs'), (93,'Lid - Flat','pcs'), (94,'Lid - Dome','pcs'),
 (95,'Straw - Coffee','pcs'), (96,'Straw - Boba','pcs'), (97,'Milk - Opened','ml'),
 (11,'Powder: Caramel','g'), (12,'Powder: Black Charcoal','g'), 
 (13,'Powder: Cookies and Cream','g'), (14,'Powder: Thai','g'),
 (15,'Powder: Matcha','g'), (16,'Powder: Strawberry','g'),
 (17,'Powder: Vanilla','g'), (18,'Powder: Dark Chocolate','g'),
 (19,'Powder: Red Velvet','g'), (20,'Powder: Chocolate Truffle','g'),
 (21,'Powder: Hershey''s Blend','g'), (22,'Powder: Cappucino','g'),
 (23,'Powder: Mocha','g'), (24,'Powder: Caramel Macchiato','g'),
 (31,'Syrup: Wintermelon','ml'), (32,'Syrup: Chocolate','ml'),
 (33,'Syrup: Salted Caramel','ml'), (34,'Syrup: Butterscotch','ml'),
 (35,'Syrup: White Chocolate','g'), (36,'Syrup: French Vanilla','ml'),
 (37,'Syrup: Hazelnut','ml'), (38,'Syrup: Caramel','g'),
 (39,'Syrup: Passionfruit','g'), (40,'Syrup: Strawberry','g'),
 (41,'Syrup: Peach','g'), (42,'Syrup: Green Apple','g'),
 (43,'Syrup: Lychee','g'), (44,'Syrup: Blueberry','g'),
 (45,'Syrup: Sweet Grapes','g'), (46,'Syrup: Kiwi','g'),
 (47,'Syrup: Lemon','g'), (48,'Powder: Creme Brulee','g'),
 (49,'Powder: Creamy Coconut','g'), (50,'Nata','g'),
 (51,'Assam','g'), (52,'Pearl','g');

-- Then, add inventory stock for all ingredients
INSERT INTO inventory_stock (id, ingredient_id, quantity) VALUES
 (10001,1,0.000), -- Milk
 (10002,2,639.000), -- Espresso
 (10003,3,395.000), -- Frappe Base
 (10004,4,423.000), -- Creamer
 (10005,5,0.000), -- Sweetener
 (10006,10,190.000), -- Powder: Chocolate
 (10007,30,130.000), -- Syrup: Brown Sugar
 (10008,90,60.000), -- Cup - Regular
 (10009,91,0.000), -- Ice
 (10010,92,0.000), -- Cup - Upsize
 (10011,93,0.000), -- Lid - Flat
 (10012,94,30.000), -- Lid - Dome
 (10013,95,41.000), -- Straw - Coffee
 (10014,96,10.000), -- Straw - Boba
 (10015,97,0.000), -- Milk - Opened
 (10016,11,815.000), -- Powder: Caramel
 (10017,12,203.000), -- Powder: Black Charcoal
 (10018,13,685.000), -- Powder: Cookies and Cream
 (10019,14,400.000), -- Powder: Thai
 (10020,15,0.000), -- Powder: Matcha
 (10021,16,0.000), -- Powder: Strawberry
 (10022,17,380.000), -- Powder: Vanilla
 (10023,18,0.000), -- Powder: Dark Chocolate
 (10024,19,154.000), -- Powder: Red Velvet
 (10025,20,229.000), -- Powder: Chocolate Truffle
 (10026,21,160.000), -- Powder: Hershey's Blend
 (10027,22,445.000), -- Powder: Cappucino
 (10028,23,806.000), -- Powder: Mocha
 (10029,24,330.000), -- Powder: Caramel Macchiato
 (10030,31,778.000), -- Syrup: Wintermelon
 (10031,32,710.000), -- Syrup: Chocolate
 (10032,33,322.000), -- Syrup: Salted Caramel
 (10033,34,0.000), -- Syrup: Butterscotch
 (10034,35,2018.000), -- Syrup: White Chocolate (918+1100)
 (10035,36,506.000), -- Syrup: French Vanilla
 (10036,37,718.000), -- Syrup: Hazelnut
 (10037,38,751.000), -- Syrup: Caramel
 (10038,39,741.000), -- Syrup: Passionfruit
 (10039,40,727.000), -- Syrup: Strawberry
 (10040,41,417.000), -- Syrup: Peach
 (10041,42,645.000), -- Syrup: Green Apple
 (10042,43,672.000), -- Syrup: Lychee
 (10043,44,940.000), -- Syrup: Blueberry
 (10044,45,250.000), -- Syrup: Sweet Grapes
 (10045,46,1098.000), -- Syrup: Kiwi
 (10046,47,514.000), -- Syrup: Lemon
 (10047,48,890.000), -- Powder: Creme Brulee
 (10048,49,507.000), -- Powder: Creamy Coconut
 (10049,50,0.000), -- Nata
 (10050,51,0.000), -- Assam
 (10051,52,0.500); -- Pearl (half = 0.5 units, assuming the unit is something like "bag" or "kg")