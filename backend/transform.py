from pyproj import Proj, transform

# 定义源坐标系和目标坐标系
proj_utm = Proj('epsg:32651')  # UTM坐标系
proj_wgs = Proj('epsg:4326')   # WGS84坐标系

# 转换坐标函数
def utm2wgs84(x, y):
    lon, lat = transform(proj_utm, proj_wgs, x, y)
    return lon, lat

def wgs842utm(lat, lng):
    x, y = transform(proj_wgs, proj_utm, lat, lng)
    return x, y
