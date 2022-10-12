<template>
    <div class="themeSetting">
        <div style="height: 50px;display: flex; align-items: center;">
            <el-divider content-position="left">更多设置</el-divider>
        </div>
        <el-form label-position="left">
            <el-form-item label="灰色模式 ">
                <el-switch
                    v-model="useSetting.greyMode"
                    @change="useSetting.greyModeChange(useSetting.greyMode)"
                />
            </el-form-item>
            <el-form-item label="色弱模式 ">
                <el-switch
                    v-model="useSetting.weakMode"
                    @change="useSetting.weakModeChange(useSetting.weakMode)"
                />
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { useSettingStore } from '../../../../store/setting';

let useSetting = useSettingStore();


</script>

<style lang="scss" >
.themeSetting {

    // 使其左右靠边
    .el-form-item__label {
        flex: 1;
    }

    .el-form-item__content {
        flex: 0 0 auto;
    }
}
</style>