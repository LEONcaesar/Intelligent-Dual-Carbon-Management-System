<template>
  <div class="app-container">
    <!-- 物料列表 -->
    <el-dialog title="选择物料档案" :model-value="open" @update:model-value="$emit('update:open', $event)" width="1000px"  @close="close" append-to-body>

      <el-row :gutter="20">
        <!--物料分类数据-->
        <el-col :span="4" :xs="24">
          <div class="head-container">
            <el-tree
              :data="classifyOptions"
              :props="defaultProps"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              ref="tree"
              node-key="id"
              default-expand-all
              highlight-current
              @node-click="handleNodeClick"
            />
          </div>
        </el-col>
        <el-col :span="20" :xs="24">
          <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
                   label-width="68px">
            <el-form-item label="物料名称" prop="materialName">
              <el-input
                v-model="queryParams.materialName"
                placeholder="请输入物料名称"
                clearable
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="default" @click="handleQuery">搜索</el-button>
              <el-button icon="el-icon-refresh" size="default" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
          <el-table v-loading="loading" :data="materialList">
            <el-table-column label="编号" align="center" prop="id"/>
            <el-table-column label="物料编码" align="center" prop="materialCode"/>
            <el-table-column label="物料名称" align="center" prop="materialName"/>
            <el-table-column label="型号" align="center" prop="materialModel"/>
            <el-table-column label="规格" align="center" prop="materialSpecifications"/>
            <el-table-column label="单位" align="center" prop="materialUnit"/>
            <el-table-column label="单价" align="center" prop="materialPrice"/>
            <el-table-column label="类型" align="center" prop="materialType">
              <template #default="scope">
                <dict-tag :options="material_type" :value="scope.row.materialType"/>
              </template>
            </el-table-column>
            <el-table-column label="备注" align="center" prop="remark"/>
            <el-table-column
              label="操作"
              align="center"
              class-name="small-padding fixed-width"
            >
              <template #default="scope">
                <el-button
                  size="default"
                  type="text"
                  icon="el-icon-edit"
                  @click="submitForm(scope.row)"
                >选择
                </el-button
                >

              </template>
            </el-table-column>
          </el-table>
        </el-col>

      </el-row>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />


    </el-dialog>
  </div>
</template>

<script setup>
import {
  listMaterial,
  getMaterial,
  delMaterial,
  classifyTreeSelect,
} from "@/api/wms/material.js";
import {ref , onMounted , getCurrentInstance} from 'vue'
import Pagination from '@/components/Pagination'
defineProps({
  open: { type: Boolean, required: true },
})
const {proxy} = getCurrentInstance()
  const {
    material_type
  } = proxy.useDict(
    "material_type"
  )
const defaultProps = ref({
        children: "children",
        label: "label",
})
const loading = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const showSearch = ref(true)
const total = ref(0)
const classifyOptions = ref(undefined)
const classifyName = ref(undefined)
const materialList = ref([])
const title = ref("")
const queryParams = ref({
        pageNum: 1,
        pageSize: 10,
        materialName: null,
})
const form = ref({})
const formRef = ref(null)
const queryForm = ref(null)

const getClassifyTree = async () => {
  classifyTreeSelect().then(res => {
    classifyOptions.value = res.data
  })
}
const filterNode = async (value,date) => {
  if(!value){
    return true
  }
  return data.label.indexOf(value) !== -1
}
const handleNodeClick = async (data) => {
  queryParams.value.classifyId = data.id
  handleQuery()
}

const getList = async (paginationParams) => {
    if(paginationParams){
        queryParams.value.pageNum = paginationParams.page
        queryParams.value.pageSize = paginationParams.limit
    }
    const res = await listMaterial(queryParams.value)
    materialList.value = res.rows
    total.value = res.total
    loading.value = false
}

const cancel = async () => {
  close()
  reset()
}

const reset = async () => {
  form.value={
        id: null,
        classifyId: null,
        materialCode: null,
        materialName: null,
        materialModel: null,
        materialSpecifications: null,
        materialUnit: null,
        materialPrice: null,
        materialType: null,
        remark: null,
  }
  if(formRef.value){
    formRef.value.resetFields()
  }
}
const handleQuery = async () => {
    queryParams.value.pageNum = 1
    await getList()
}

const resetQuery = async () => {
    queryForm.value.resetFields()
    handleQuery()
}

const emit = defineEmits(['update:open','close','fun'])
// 关闭对话框逻辑
const close = () => {
  emit('update:open', false) // 同步关闭状态
  emit('close')              // 触发关闭事件
}

// 表单提交逻辑
const submitForm = async (row) => {
  try {
    emit('fun', row) 
    console.log(row)
    close()                 // 提交后关闭对话框
  } catch (error) {
    console.error('提交失败:', error)
  }
}
onMounted(() => {
  getList(),
  getClassifyTree()
})
</script>
