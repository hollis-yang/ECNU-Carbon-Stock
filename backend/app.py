from flask import Flask, request, jsonify
from flask_cors import CORS
import geopandas as gpd
import pandas as pd
from shapely.geometry import Point
from transform import wgs842utm

app = Flask(__name__)
CORS(app)

@app.route('/tree', methods=['POST'])
def nearest_tree():
    # 读取请求中的经纬度和区域列表
    data = request.get_json()
    lng = data['lng']
    lat = data['lat']
    regions = data['region']  # region数组
    print(regions)

    # 转成xy坐标
    x, y = wgs842utm(lat, lng)

    # 初始化一个空的GeoDataFrame
    combined_gdf = gpd.GeoDataFrame()

    # 循环读取每个区域的GeoJSON文件并合并
    for region in regions:
        gdf = gpd.read_file(f'./{region}.geojson')
        combined_gdf = pd.concat([combined_gdf, gdf], ignore_index=True)

    # 创建一个shapely的点对象代表你提供的经纬度
    point_of_interest = Point(x, y)
    # 计算每棵树与该点的距离
    combined_gdf['distance'] = combined_gdf.geometry.distance(point_of_interest)
    # 找到距离最近的树的信息
    nearest_tree = combined_gdf.loc[combined_gdf['distance'].idxmin()]

    # 去掉不需要的字段后将nearest_tree的数据转换成可序列化的格式
    nearest_tree_dict = nearest_tree.drop(['geometry', 'distance']).to_dict()
    # 转换为字典并返回
    return jsonify(nearest_tree_dict)

@app.route('/treeid', methods=['POST'])
def get_tree_withid():
    # 读取id并拆分为region和treeid
    data = request.get_json()
    id = data['id']
    region= id.split('-')[0]
    
    # 读取GeoJSON文件
    gdf = gpd.read_file(f'./{region}.geojson')
    # 获取树木信息
    res_gdf = gdf[gdf['id'] == id]
    
    # 去掉不需要的字段后转换成可序列化的格式
    tree_dict = res_gdf.drop(columns=['geometry']).to_dict(orient='records')
    # 转换为字典并返回
    return jsonify(tree_dict)

if __name__ == '__main__':
    app.run(host="127.0.0.1", port=5000, debug=True)
