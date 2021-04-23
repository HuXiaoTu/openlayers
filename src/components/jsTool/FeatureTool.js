// import { lineString } from '@turf/helpers';
// import lineIntersect from '@turf/line-intersect';
import { Feature } from 'ol';
import { add } from 'ol/coordinate';
import { LineString, Point, Polygon, MultiPolygon } from 'ol/geom';
import LayerGroup from 'ol/layer/Group';
import VectorLayer from 'ol/layer/Vector';
import { fromLonLat, toLonLat } from 'ol/proj';
/**
 * 
 * @description feature相关工具类
 * @author WangYin
 */
export default class FeatureTool {
    /**
     * 判断feature是否为闭合的
     * @param {Feature} feature 
     */
    static isPolygon(feature) {
        let geometry = feature.getGeometry();
        let isPolygon = geometry instanceof Polygon || geometry instanceof MultiPolygon;
        return isPolygon;
    }


    // /**
    //  * @description 判断两个feature是否相交 支持线-线 线-多边形 多边形-多边形 
    //  * @param {Feature} f1
    //  * @param {Feature} f2 
    //  */
    // static isIntersect(f1, f2) {
    //     let line1, line2;
    //     let coor1, coor2;
    //     if (f1 && f1.getGeometry() instanceof Polygon) {
    //         coor1 = f1.getGeometry().getCoordinates()[0];
    //         if (!coor1 || coor1.length <= 0) return;
    //         line1 = lineString(coor1);
    //     } else if (f1 && f1.getGeometry() instanceof LineString) {
    //         coor1 = f1.getGeometry().getCoordinates();
    //         if (!coor1 || coor1.length <= 0) return;
    //         line1 = lineString(f1.getGeometry().getCoordinates());
    //     }
    //     if (f2 && f2.getGeometry() instanceof Polygon) {
    //         coor2 = f2.getGeometry().getCoordinates()[0];
    //         if (!coor2 || coor2.length <= 0) return;
    //         line2 = lineString(coor2);
    //     } else if (f2 && f2.getGeometry() instanceof LineString) {
    //         coor2 = f2.getGeometry().getCoordinates();
    //         if (!coor2 || coor2.length <= 0) return;
    //         line2 = lineString(coor2);
    //     }
    //     if (!line1 || !line2) {
    //         console.error('仅支持判断线或者多边形的相交');
    //         return undefined;
    //     }
    //     let intersects = lineIntersect(line1, line2);//相交的点features
    //     if (intersects && intersects.features.length > 0) {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }
    /**
     * 判断feature 和 区间coordinates是否相交
     * @param {Feature} feature 
     * @param {Array} coordinates 
     */
    static intersect(feature, coordinates) {
        let geometry = feature.getGeometry();
        let coordinates2;
        if (geometry instanceof Point) {
            coordinates2 = [geometry.getCoordinates()];
        } else if (geometry instanceof Polygon) {
            coordinates2 = geometry.getCoordinates()[0];
        } else {
            coordinates2 = geometry.getCoordinates();
        }
        let area = new Polygon([coordinates]);
        for (let coordinate of coordinates2) {
            let flag = area.intersectsCoordinate(coordinate);
            if (flag) {
                return true;
            }
        }
        return false;
    }


    /**
       * 判断feature是否为点
       * @param {Feature} feature 
       */
    static isPoint(feature) {
        let geometry = feature.getGeometry();
        let point = geometry instanceof Point;
        return point;
    }

    static getFeatureBaseVertex(feature) {
        let coordinateArry = feature.getProperties().vertex
        return coordinateArry;
    }

    /**
     * 选中
     * @param {Feature} feature 
     */
    static showFeatureSelected(feature) {
        feature.set('selected', true, false);
    }
    /**
     * 取消选中
     * @param {Feature} feature 
     */
    static endShowFeatureSelected(feature) {
        feature.set('selected', false, false);
    }

    static offFeature(feature, offX, offY) {
        let geometry = feature.getGeometry();
        geometry.translate(offX, offY);
        // offVertex
        FeatureTool.offFeatureVertex(feature, offX, offY);
        // off extent
        FeatureTool.offFeatureExtent(feature, offX, offY);
        if (feature.refreshBaseData) {
            // 用于普通云移动时刷新相关云的位置信息
            feature.refreshBaseData(feature, offX, offY);
        }
    }
    //平移vertex
    static offFeatureVertex(feature, offX, offY) {
        let coordinateArry = feature.getProperties().vertex;
        //vertex不存在时不处理
        if (coordinateArry && coordinateArry.length > 0) {
            for (let index = 0; index < coordinateArry.length; index++) {
                let element = coordinateArry[index];
                coordinateArry[index] = add(element, [offX, offY]);
            }
        }
    }
    //平移文字范围坐标
    static offFeatureExtent(feature, offX, offY) {
        let coordinateArry = feature.getProperties().extent;
        //extent不存在时不处理
        if (coordinateArry && coordinateArry.length > 0) {
            for (let index = 0; index < coordinateArry.length; index++) {
                let element = coordinateArry[index];
                coordinateArry[index] = add(element, [offX, offY]);
            }
        }
    }

    /**
     * 设置feature为不可拖拽
     * @param {Feature} feature 
     */
    static setFeatureNotDragable(feature) {
        feature.setProperties({ 'isNotDragable': true }, true);
    }
    /**
     * 设置feature是否可拖拽
     * @param {Feature} feature 
     * @param {Boolean} status true:可拖拽 false:不可拖拽
     */
    static setFeatureDragable(feature, status) {
        feature.setProperties({ 'isNotDragable': !status }, true);
    }

    /**
     * 判断feature 是否可移动，如果true,不可移动，否则可移动
     * @param {Feature} feature 
     */
    static isNotDragable(feature) {
        return feature.getProperties().isNotDragable;
    }

    /**
     * 设置feature对修改vertex动作是否响应
     * @param {Feature} feature 
     * @param {boolean} modifyable 
     */
    static setFeatureModifyable(feature, modifyable) {
        feature.set('isModifyable', modifyable, true);
    }

    /**
     * 是否feature对修改vertex动作响应
     * @param {Feature} feature 
     */
    static isModifyable(feature) {
        return feature.get('isModifyable');
    }

    /**
     * 设置为mark
     * @param {Feature} feature 
     */
    static setTypeMark(feature) {
        // 设置mark
        feature.set('isMark', 1, true);
    }
    /**
     * 设置为mark并设置id
     * @param {Feature} feature 
     */
    static setTypeMarkAndID(feature) {
        feature.setId(feature.ol_uid);
        // 设置mark
        feature.set('isMark', 1, true);
    }

    /**
     * 设置feature的文字范围
     * @param {Feature} feature 
     * @param {[[p1,p2,p3],[p1,p2,p3,p4,p5]]} textExtent 文本框的坐标范围[范围1,范围2,范围3...] 每个范围的坐标点必须是顺时针或者逆时针 例: [p1,p2,p3...]点的顺序是顺时针或者逆时针的顺序
     */
    static setTextExtent(feature, textExtent, silence = true) {
        feature.setProperties({ "textExtent": textExtent }, silence);//设置文字的extent,默认不触发重绘
    }


    /**
 * 设置用于遮盖计算的textExtend
 * @param {Feature} feature 
 * @param {Array} extend 
 */
    static setTextExtentByFeatureExtent(feature, extent) {
        let [minX, minY, maxX, maxY] = extent;
        FeatureTool.setTextExtent(feature, [[[minX, minY], [minX, maxY], [maxX, maxY], [maxX, minY]]]);
    }

    /**
     * 获取feature的文字范围
     * @param {Feature} feature 
     */
    static getTextExtent(feature) {
        //console.info('feature.get(textExtent)-->', feature.get('textExtent'));
        return feature.get('textExtent');
    }


    static setFeaturePointUnModifiable(feature) {
        feature.set('pointUnModifiable', true, true);
    }

    static isFeaturePointUnModifiable(feature) {
        return feature.get('pointUnModifiable');
    }

    /**
     * @description 设置feature为无右侧菜单
     * @param {Feature} feature 
     * @param {Boolean} flag true:无菜单 false:有彩蛋
     */
    static setNoMenu(feature, flag = true) {
        feature.set('no_menu', flag, true);
    }
    /**
     * @description 设置feature是否有右键菜单
     * @param {Feature} feature 
     * @param {Boolean} flag true:有菜单 false:无菜单
     */
    static setRightMenu(feature, flag = true) {
        feature.set('no_menu', !flag, true);
    }

    /**
     * @description 判断feature是不是无右侧菜单
     * @param {Feature} feature 
     */
    static isNoMenu(feature) {
        return feature.get('no_menu');
    }


    /**
     * @description 标记为第一个mark  (有多个mark的时候，第一个mark的isMark为2，其余为1)
     * @param {Feature} feature 
     */
    static setTypeMarkAndFirst(feature) {
        feature.set('isMark', 2, true);
        this.setNotDeletableBySelf(feature)
    }

    /**
     * 判断是否为第一个mark
     * @param {Feature} feature 
     */
    static isMarkFeatureAndFirst(feature) {
        if (feature == undefined) {
            return false;
        }
        let featureType = feature.getProperties().isMark;
        return featureType == 2;
    }

    /**
     * 设置为不可以自己删除
     * @param {Feature} feature 
     */
    static setNotDeletableBySelf(feature) {
        feature.set('notDeletable', true, true);
    }

    /**
     * 设置光标移动事件处理方法
     * @param {Feature} feature 
     * @param {function} action 
     */
    static setMoveEventAction(feature, action) {
        feature.moveEventAction = action;
    }

    /**
     * 获得标移动事件处理方法
     * @param {*} feature 
     */
    static getMoveEventAction(feature) {
        if (feature) {
            return feature.moveEventAction;
        }
    }

    /**
     * 执行光标的移动事件处理方法
     * @param {*} feature 
     */
    static doMoveEventAction(feature) {
        let action = this.getMoveEventAction(feature);
        if (action) {
            action(feature);
        }
    }

    /**
     * 是否不可以自己删除
     * @param {Feature} feature 
     */
    static isNotDeletableBySelf(feature) {
        return feature.get('notDeletable');
    }


    /**
     * 设置为需要遮盖处理的多边形
     * @param {*} feature 
     */
    static setOverlapPolygon(feature) {
        feature.set("isOverlapPolygon", true, true);
    }

    /**
     * 是否为需要遮盖处理的多边形
     * @param {*} feature 
     */
    static isOverlapPolygon(feature) {
        return feature.get('isOverlapPolygon');
    }

    /**
     * 判断是否为mark
     * @param {Feature} feature 
     */
    static isMarkFeature(feature) {
        if (feature == undefined) {
            return;
        }
        let featureType = feature.get('isMark');
        if (featureType == 1 || (featureType == 2)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @description 在mapPara中删除feature
     * @param feature 要删除的feature
     * @param map 所在map,不传默认是当前map
     * @returns 
     */
    static delFeatureFromMap(feature) {
        let result = null;
        map.getLayers().forEach(layer => {
            if (layer instanceof VectorLayer) {//矢量图层
                layer.getSource().getFeatures().forEach(f => {
                    if (feature == f) {
                        result = layer;
                        return true;
                    }
                });
            } else if (layer instanceof LayerGroup) {//图层组
                layer.getLayers().forEach(l => {
                    if (l instanceof VectorLayer) {//矢量图层
                        l.getSource().getFeatures().forEach(f => {
                            if (feature == f) {
                                result = l;
                                return true;
                            }
                        });
                    }
                });
            }
        });
        result.getSource().removeFeature(feature);
    }

    /**
    * @description 在map中按照featureType删除feature
    * @param featureType 要删除的featureType
    * @param map 所在map,不传默认是当前map
    * @returns 
    */
    static delFeatureFromMapByType(featureType, map) {
        map.getLayers().forEach(layer => {
            if (layer instanceof VectorLayer) {//矢量图层
                layer.getSource().getFeatures().forEach(f => {
                    if (featureType == f.get('featureType')) {
                        layer.getSource().removeFeature(f);
                        return;
                    }
                });
            } else if (layer instanceof LayerGroup) {//图层组
                layer.getLayers().forEach(lay => {
                    if (lay instanceof VectorLayer) {//矢量图层
                        lay.getSource().getFeatures().forEach(f => {
                            if (featureType == f.get('featureType')) {
                                lay.getSource().removeFeature(f);
                                return;
                            }
                        });
                    }
                });
            }
        });
    }

    /**
     * @description 给feature添加修改时drag的处理方法
     * @param {*} feature 需要设置的feature
     * @param {*} handler 修改的drag事件的处理函数
     */
    static setDragAction(feature, handler) {
        feature.drag = handler;
    }
    /**
     * @description 给feature添加平移时的处理方法
     * @param {*} feature 需要设置的feature
     * @param {*} handler move事件的处理函数
     */
    static setMoveAction(feature, handler) {
        feature.move = handler;
    }
    /**
     * @description 给feature添加平移时的处理方法
     * @param {*} feature 需要设置的feature
     * @param {*} handler move事件的处理函数
     */
    static setMoveendAction(feature, handler) {
        feature.moveend = handler;
    }
    /**
     * @description 给feature添加修改交互下右键的[加点]的拦截处理方法
     * @param {*} feature 需要设置的feature
     * @param {*} handler 事件的处理函数
     */
    static setAddPointIntercept(feature, handler) {
        feature.addPointIntercept = handler;
    }
    /**
     * @description 给feature添加修改交互下右键的[加点]或者[减点]成功后的回调
     * @param {*} feature 需要设置的feature
     * @param {*} callback 事件的处理回调函数
     */
    static setPointChangeCallback(feature, callback) {
        feature.pointChangeCallback = callback;
    }
    /**
     * @description 给feature添加修改交互下右键的[减点]的拦截处理方法
     * @param {*} feature 需要设置的feature
     * @param {*} handler 事件的处理函数
     */
    static setRemovePointIntercept(feature, handler) {
        feature.removePointIntercept = handler;
    }
    /**
     * @description 将feature经纬度坐标转换为指定投影坐标的coordinate
     * @param {*} features 需要转换的feature
     * @param {*} projCode 指定投影坐标code例如 EPSG:4326
     */
    static transCoordinateFromLonLat(features, projCode) {
        let geo, coor;
        features.forEach(element => {
            geo = element.getGeometry();
            coor = geo.getCoordinates();
            geo.setCoordinates(fromLonLat(coor, projCode));
        });
    }
    /**
     * @description 将feature指定投影坐标转换为经纬度坐标的coordinate
     * @param {*} features 需要转换的feature
     * @param {*} projCode 指定投影坐标code例如 EPSG:4326
     */
    static transCoordinateToLonLat(features, projCode) {
        let geo, coor;
        features.forEach(element => {
            geo = element.getGeometry();
            coor = geo.getCoordinates();
            geo.setCoordinates(toLonLat(coor, projCode));
        });
    }
    /**
     * @description 将feature标识为等值线 用于等值线修改交互判断是否需要对其进行修改
     * @param {*} feature 需要标记的feature
     */
    static setIsContour(feature, flag = true) {
        if (!feature) {
            return false;
        }
        feature.set('isContour', flag);
    }
    /**
     * @description 判断feature是否为等值线
     * @param {*} feature 需要标记的feature
     */
    static isContour(feature) {
        if (!feature) {
            return false;
        }
        return feature.get('isContour');
    }

    /**
     * @description 设置feature简化参数
     * @param {Feature} feature 
     * @param {Number} simplifyRactor 简化系数 
     */
    static simplifyInit(feature, simplifyRactor) {
        let geometry = feature.getGeometry()
        if (geometry instanceof Point) return;
        feature.set("simplifyRactor", simplifyRactor);
        let allVertex;
        if (geometry instanceof LineString) {
            allVertex = geometry.getCoordinates();
        } else if (geometry instanceof Polygon) {
            allVertex = geometry.getCoordinates()[0];
        } else {
            return;
        }
        feature.set("allVertex", allVertex);
        feature.set("simplify", true);
    }

}