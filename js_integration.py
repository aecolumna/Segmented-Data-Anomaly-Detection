import sys
import random

x = sys.argv[1]
y = sys.argv[2]
z = sys.argv[3]


#print("x: ", x)
#print("y: ", y)
#print("z: ", z)


results = {x: int(x)*x, y: int(y)*y, z:int(z)*z}
print(str(results))
sys.stdout.flush()