// 静态展示 按钮 列表
export const staticDisplayList = [
    {
        name: '风温',
        type: 'windTemperature'
    },
    {
        name: '风矢量',
        type: 'windArrow'
    },
    {
        name: '格点值',
        type: 'gridPoint'
    },
    {
        name: '等值线',
        type: 'isoLine'
    },
    {
        name: '填色图',
        type: 'colouring'
    },
    {
        name: '色斑图',
        type: 'colorBoard'
    },
]
// 静态绘制 符号 列表
export const symbolList = [
    {
        iconClass: '#icontempCenter',
        isActive: false,
        title: "温度中心",
        featureType: "TemperatureCenter",
        btnType: "W_C_point"
    },
    {
        iconClass: '#iconhlPressure',
        isActive: false,
        title: "高低压中心/高低位势中心",
        featureType: "PressCenter",
        btnType: "H_L_point"
    },
    {
        iconClass: '#icontempColdCenter',
        isActive: false,
        title: "温度冷中心/冷堆",
        featureType: "ColdCenter",
        btnType: "point"
    },
    {
        iconClass: '#iconsingleRain',
        isActive: false,
        title: "单站降水",
        featureType: "WeatherSingle",
        drawType: "Rain",
        btnType: "point"
    },
    {
        iconClass: '#iconhotCyclone',
        isActive: false,
        title: "热带气旋",
        featureType: "Hotcyclone",
        btnType: "point"
    },
    {
        iconClass: '#iconsinglePointSymbol',
        isActive: false,
        title: "单点符号",
        featureType: "SinglePoint",
        btnType: "SinglePoint"
    },
    {
        iconClass: '#iconweatherArea2',
        isActive: false,
        title: "天气区",
        featureType: "AnalysisWeatherArea2",
        btnType: "area"
    },
    {
        iconClass: '#iconisobaricLine',
        isActive: false, title: "等压线",
        featureType: "AnalysisContourPress",
        btnType: "lineWithHeight",
        heightArr: [
            { label: "200hPa", id: 200 },
            { label: "500hPa", id: 500 },
            { label: "地面分析", id: 9999 },
        ]
    },
    {
        iconClass: '#iconisobaricLine',
        isActive: false, title: "等风速线",
        featureType: "AnalysisContourWind",
        btnType: "lineWithHeight",
        heightArr: [
            { label: "200hPa", id: 200 },
            { label: "500hPa", id: 500 },
            { label: "地面分析", id: 9999 },
        ]
    },
    {
        iconClass: '#iconisobaricLine',
        isActive: false, title: "等高线",
        featureType: "AnalysisContourHeight",
        btnType: "lineWithHeight",
        heightArr: [
            { label: "200hPa", id: 200 },
            { label: "500hPa", id: 500 },
            { label: "地面分析", id: 9999 },
        ]
    },
    {
        iconClass: '#iconupLine',
        isActive: false,
        title: "等变压线",
        featureType: "VarContourPress",
        btnType: "line"
    },
    {
        iconClass: '#iconchangeHighLine',
        isActive: false,
        title: "24小时变高",
        featureType: "VariableHeight24Hour",
        btnType: "lineWithoutType",
        heightArr: [
            { label: "500hPa", id: 500 },
        ]
    },
    {
        iconClass: '#icontempLine',
        isActive: false,
        title: "等温线",
        featureType: "TemperatureContour",
        btnType: "lineWithHeight",
        heightArr: [
            { label: "500hPa", id: 500 },
            { label: "700hPa", id: 700 },
            { label: "850hPa", id: 850 },
            { label: "925hPa", id: 925 },
            { label: "地面分析", id: 9999 },
        ]
    },
    {
        iconClass: '#icontempWetLine',
        isActive: false,
        title: "等露点温度线/等比湿线",
        featureType: "DewPointHumidityContour",
        btnType: "lineWithHeight",
        heightArr: [
            { label: "700hPa", id: 700 },
            { label: "850hPa", id: 850 },
            { label: "925hPa", id: 925 },
            { label: "地面分析", id: 9999 },
        ]
    },
    {
        iconClass: '#icondryLine',
        isActive: false,
        title: "干线",
        featureType: "DryLine",
        btnType: "lineWithoutType",
        heightArr: [
            { label: "700hPa", id: 700 },
            { label: "925hPa", id: 925 },
            { label: "地面分析", id: 9999 },
        ]
    },
    {
        iconClass: '#icontempPointLine',
        isActive: false,
        title: "等温度露点差线",
        featureType: "EqualTempDewPointDiff",
        btnType: "lineWithHeight",
        heightArr: [
            { label: "700hPa", id: 700 },
            { label: "850hPa", id: 850 },
            { label: "925hPa", id: 925 },
            { label: "地面分析", id: 9999 },
        ]
    },
    {
        iconClass: '#icontempSlot',
        isActive: false,
        title: "温度槽冷槽",
        featureType: "ColdTrough",
        btnType: "lineWithoutType",
        heightArr: [
            { label: "500hPa", id: 500 },
            { label: "700hPa", id: 700 },
        ]
    },
    {
        iconClass: '#icontemperatureRidge',
        isActive: false,
        title: "温度脊暖脊",
        featureType: "WarmTrough",
        btnType: "lineWithoutType",
        heightArr: [
            { label: "700hPa", id: 700 },
            { label: "850hPa", id: 850 },
            { label: "925hPa", id: 925 },
        ]
    },
    {
        iconClass: '#icondiffLine',
        isActive: false,
        title: "700与500温度差/850与500温度差",
        featureType: "TemperatureDiff500",
        btnType: "lineWithHeight",
        heightArr: [
            { label: "700hPa", id: 700 },
            { label: "850hPa", id: 850 },
        ]
    },
    {
        iconClass: '#iconchangTempLine',
        isActive: false,
        title: "变温线",
        featureType: "VariableTemperature",
        btnType: "lineWithoutType",
        heightArr: [
            { label: "500hPa", id: 500 },
            { label: "700hPa", id: 700 },
        ]
    },
    {
        iconClass: '#icondryTongue',
        isActive: false,
        title: "干舌",
        featureType: "DryTongue",
        btnType: "lineWithoutType",
        heightArr: [
            { label: "500hPa", id: 500 },
            { label: "700hPa", id: 700 },
        ]
    },
    {
        iconClass: '#iconwetTongue',
        isActive: false,
        title: "湿舌",
        featureType: "WetTongue",
        btnType: "lineWithoutType",
        heightArr: [
            { label: "850hPa", id: 850 },
            { label: "925hPa", id: 925 },
            { label: "地面分析", id: 9999 },
        ]
    },
    {
        iconClass: '#iconrapids',
        isActive: false,
        title: "急流",
        featureType: "JetStreamAnalysis",
        btnType: "lineWithoutType",
        heightArr: [
            { label: "200hPa", id: 200 },
            { label: "500hPa", id: 500 },
            { label: "700hPa", id: 700 },
            { label: "850hPa", id: 850 },
            { label: "925hPa", id: 925 },
        ]
    },
    {
        iconClass: '#iconjetStream',
        isActive: false,
        title: "急流核",
        featureType: "JetStreamCore",
        btnType: "lineWithoutType",
        heightArr: [
            { label: "200hPa", id: 200 },
        ]
    },
    {
        iconClass: '#iconjetStreamLine',
        isActive: false,
        title: "显著流线",
        featureType: "JetStreamNotable",
        btnType: "lineWithoutType",
        heightArr: [
            { label: "500hPa", id: 500 },
            { label: "700hPa", id: 700 },
            { label: "850hPa", id: 850 },
            { label: "925hPa", id: 925 },
            { label: "地面分析", id: 9999 },
        ]
    },
    {
        iconClass: '#iconwarmFront',
        isActive: false,
        title: "暖锋",
        featureType: "WarmFrontAnalysis",
        btnType: "lineWidth"
    },
    {
        iconClass: '#iconstationaryFront',
        isActive: false,
        title: "静止锋",
        featureType: "StationaryFrontAnalysis",
        btnType: "lineWidth"
    },
    {
        iconClass: '#iconoccludedFront',
        isActive: false,
        title: "锢囚锋",
        featureType: "OccludedFrontAnalysis",
        btnType: "lineWidth"
    },
    {
        iconClass: '#iconcoldFront',
        isActive: false,
        title: "冷锋",
        featureType: "ColdFrontAnalysis",
        btnType: "lineWidth"
    },
    {
        iconClass: '#iconslotLine',
        isActive: false,
        title: "切变线/槽线",
        featureType: "SlotLine",
        btnType: "line"
    },
    {
        iconClass: '#iconconvergenceLine',
        isActive: false,
        title: "辐合线",
        featureType: "ConvergenceAnalysis",
        btnType: "lineWithoutTypeHeight"
    },
    {
        iconClass: '#iconsquallline',
        isActive: false,
        title: "飑线",
        featureType: "SqualllineAnalysis",
        btnType: "lineWithoutTypeHeight"
    },
]