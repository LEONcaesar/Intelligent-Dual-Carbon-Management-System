<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm"  :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item label="设备名称" prop="deviceName">
                <el-input
                style="border: 1px solid #dcdfe6; border-radius: 5px;"
                v-model="queryParams.deviceName"
                placeholder="请输入设备名称"
                clearable
                @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="创建时间">
                <el-date-picker
                v-model="daterangeManufactureDate"
                style="width: 240px;"
                value-format="YYYY-MM-DD"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="开始日期"
                ></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery" style="width: 45px;">搜索</el-button>
                <el-button icon="el-icon-refresh" size="small" @click="resetQuery" style="width: 45px;">重置</el-button>
            </el-form-item>
        </el-form>
        <el-row :gutter="10" class="mb8">
            <el-col span="1.5">
                <el-button
                type="warning"
                plain
                size="small"
                
                >导出</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="collectionList">
            <el-table-column label="序号" align="center" type="index" />
            <el-table-column label="设备名称" align="center" prop="deviceName"/>
            <el-table-column label="已产数量" align="center" prop="quantityProduced"/>
            <el-table-column label="单位耗电量" align="center" prop="unitPowerConsumption"/>
            <el-table-column label="总耗电量" align="center" prop="totalPowerConsume"/>
            <el-table-column label="单位碳排放" align="center" prop="carbonEmission"/>
            <el-table-column label="总碳排放" align="center" prop="totalCarbonEmission"/>

        </el-table>

        <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
        />
    </div>
</template>


<script setup>
import {listCollection} from '@/api/dc/collection.js'
import {ref,onMounted} from 'vue'
import Pagination from '@/components/Pagination'
const loading = ref(true)
const total = ref(0)
const collectionList = ref([])
const queryForm = ref(null)
const showSearch = ref(true)
const daterangeManufactureDate = ref([])
const queryParams = ref({
    pageNum:1,
    pageSize:10,
    deviceName:null,
    manufactureDate:null
})
const getList = async (paginationParams) => {
    loading.value = true
    if(paginationParams){
        queryParams.value.pageNum = paginationParams.page
        queryParams.value.pageSize = paginationParams.limit
    }
    queryParams.value.params={}
    if(daterangeManufactureDate.value && daterangeManufactureDate.value.length === 2){
        queryParams.value.params.beginManufactureDate = daterangeManufactureDate.value[0]
        queryParams.value.params.endManufactureDate = daterangeManufactureDate.value[1]
    }
    const res = await listCollection(queryParams.value)
    collectionList.value = res.rows
    total.value = res.total
    loading.value = false
}
const handleQuery = async () =>{
    queryParams.value.pageNum=1
    getList()
}
const resetQuery = async () =>{
    daterangeManufactureDate.value = ref([])
    queryForm.value.resetFields()
    getList()
}
onMounted(() => getList())
</script>