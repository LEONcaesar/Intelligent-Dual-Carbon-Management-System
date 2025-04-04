<template>
    <div class="app-container">
      <el-form
        :model="queryParams"
        ref="queryForm"
        :inline="true"
        label-width="68px"
      >
        <el-form-item label="检验项" prop="checkItem">
          <el-input
            v-model="queryParams.checkItem"
            placeholder="请输入检验项"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
  
        <el-form-item label="检验类型" prop="checkType">
          <el-select v-model="queryParams.checkType" placeholder="请选择检验类型" style="width: 150px;">
            <el-option
            
            v-for="dict in mes_check_type"
            :key="dict.value"
            :label="dict.label"
            :value="parseInt(dict.value)"
            @keyup.enter.native="handleQuery"
            ></el-option>
          </el-select>
        </el-form-item>
  
        <el-form-item label="物料名称" prop="materialName">
          <el-input
            v-model="queryParams.materialName"
            placeholder="请输入物料名称"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
  
        <el-form-item>
          <el-button
            type="primary"
            @click="handleQuery"
          ><el-icon><Search/></el-icon>搜索
          </el-button
          >
          <el-button  @click="resetQuery"
          ><el-icon><Refresh/></el-icon>重置
          </el-button
          >
        </el-form-item>
      </el-form>
  
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            @click="handleAdd"
          ><el-icon><Plus/></el-icon>新增
          </el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            :disabled="single"
            @click="handleUpdate"
          ><el-icon><Edit/></el-icon>修改
          </el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            :disabled="multiple"
            @click="handleDelete"
          ><el-icon><Delete/></el-icon>删除
          </el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            @click="handleExport"
          ><el-icon><Download/></el-icon>导出
          </el-button
          >
        </el-col>
        <right-toolbar
          :showSearch.sync="showSearch"
          @queryTable="getList"
        ></right-toolbar>
      </el-row>
  
      <el-table
        v-loading="loading"
        :data="standardsList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column label="编号" align="center" prop="id"/>
        <el-table-column label="物料名称" align="center" prop="materialName"/>
        <el-table-column label="型号" align="center" prop="materialModel"/>
        <el-table-column label="规格" align="center" prop="materialSpecifications"/>
        <el-table-column label="单位" align="center" prop="materialUnit"/>
        <el-table-column label="检验项" align="center" prop="checkItem"/>
        <el-table-column label="检验类型" align="center" prop="checkType">
          <template #default="scope">
            <dict-tag :options="mes_check_type" :value="scope.row.checkType"/>
          </template>
        </el-table-column>
        <el-table-column label="标准值上限" align="center" prop="upLimit"/>
        <el-table-column label="标准值下限" align="center" prop="lowerLimit"/>
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template #default="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
            >修改
            </el-button
            >
            <el-button
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
            >删除
            </el-button
            >
          </template>
        </el-table-column>
      </el-table>
  
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
      <MateriaDialog v-model:open="materialOpen" @fun="selectMaterial" @close="close"/>
      <!-- 添加或修改检验标准对话框 -->
      <el-dialog :title="title" v-model="open" width="600px" append-to-body>
        <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
          <el-form-item label="物料" prop="materialName">
            <el-input v-model="form.materialName" placeholder="请选择物料" disabled>
                <template #append>
                    <el-button  @click="openDialog">选择</el-button>
                </template>
            </el-input>
          </el-form-item>
          <el-form-item label="检验项目名称" prop="checkItem">
            <el-input v-model="form.checkItem" placeholder="请输入检验项"/>
          </el-form-item>
          <el-form-item label="检验类型" prop="checkType">
            <el-select v-model="form.checkType">
              <el-option
                v-for="dict in mes_check_type"
                :key="dict.value"
                :label="dict.label"
                :value="parseInt(dict.value)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标准值上限" prop="upLimit">
            <el-input v-model.number="form.upLimit" placeholder="请输入标准值上限"/>
          </el-form-item>
          <el-form-item label="标准值下限" prop="lowerLimit">
            <el-input v-model.number="form.lowerLimit" placeholder="请输入标准值下限"/>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" placeholder="请输入备注"/>
          </el-form-item>
        </el-form>
  
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </template>
  
  <script setup>
  import {
    listStandards,
    getStandards,
    delStandards,
    addStandards,
    updateStandards,
  } from "@/api/mes/standards";
  import MateriaDialog from "@/views/components/MateriaDialog/index.vue";
  import { ElMessage,ElMessageBox } from 'element-plus'
  import {ref,onMounted,getCurrentInstance} from 'vue'
  import Pagination from '@/components/Pagination'
  const {proxy} = getCurrentInstance()
  const {
    mes_check_type
  } = proxy.useDict(
    "mes_check_type"
  )
  const loading = ref(true)
  const ids = ref([])
  const single = ref(true)
  const multiple = ref(true)
  const showSearch = ref(true)
  const total = ref(0)
  const title = ref("")
  const open = ref(false)
  const form = ref({})
  const formRef = ref(null)
  const queryForm = ref(null)
  const standardsList = ref([])
  const material = ref(null)
  const materialOpen = ref(false)
  const queryParams = ref({
        pageNum: 1,
        pageSize: 10,
        materialId: null,
        checkItem: null,
        checkType: null,
        upLimit: null,
        lowerLimit: null,
        materialName: null
  })
  const rules = {
        checkItem:[{ required: true, message: "检验项目名称不能为空", trigger: "blur" }],
        checkType:[{ required: true, message: "检验类型不能为空", trigger: "blur" }],
        upLimit:[
          { required: true, message: "标准值上限不能为空", trigger: "blur" },
          { type: 'number', message: '检验值上限必须为数字值', trigger: 'blur' }
        ],
        lowerLimit:[
          { required: true, message: "标准值下限不能为空", trigger: "blur" },
          { type: 'number', message: '检验值下限必须为数字值', trigger: 'blur' }
        ]
  }
  const getList = async (paginationParams) => {
    loading.value = true
    if(paginationParams){
        queryParams.value.pageNum = paginationParams.page
        queryParams.value.pageSize = paginationParams.limit
    }
    const res = await listStandards(queryParams.value)
    standardsList.value = res.rows
    total.value = res.total
    loading.value = false
  }
  const openDialog = async () => {
    materialOpen.value = true
    
  }
  const selectMaterial = async (val) => {
    form.value.materialName = val.materialName
    form.value.materialId = val.id
  }
  const close = async () => {
    materialOpen.value = false
  }
  const cancel = async () => {
    open.value = false
    reset()
  }
  const reset = async () => {
    form.value = {
        id: null,
        materialId: null,
        checkItem: null,
        checkType: null,
        upLimit: null,
        lowerLimit: null,
        remark: null,
        materialName: null
    }
    if(formRef.value){
        formRef.value.resetFields()
    }
  }
  const handleQuery = async () => {
    queryParams.value.pageNum=1
    await getList()
  }
  const resetQuery = async () => {
    queryForm.value.resetFields()
    handleQuery()
  }
  const handleSelectionChange = async (selection) => {
    ids.value = selection.map(item => item.id)
    single.value = selection.length !=1
    multiple.value = !selection.length
  }
  const handleAdd = async () => {
    reset()
    open.value = true
    title.value = "添加检验标准"
  }
  const handleUpdate = async(row) => {
    reset()
    const id = row.id || ids.value[0]
    getStandards(id).then(res => {
        form.value = res.data
        open.value = true
        title.value = "修改检验标准"
    })
  }
  const submitForm =async () => {
    if(formRef.value){
        formRef.value.validate(valid => {
            if(valid){
                if(form.value.id != null){
                    console.log(form.value)
                    updateStandards(form.value).then(res => {
                        ElMessage.success("修改成功")
                        open.value = false
                        getList()
                    })
                }else{
                    addStandards(form.value).then(res => {
                        ElMessage.success("新增成功")
                        open.value = false
                        getList()
                    })
                }
            }
        })
    }
  }
  const handleDelete = async (row) => {
    const Ids = row.id || ids.value
    ElMessageBox.confirm('是否确认删除检验标准编号为"'+ Ids + '"的数据项？',{
        confirmButtonText:'确认',
        cancelButtonText:'取消'
    }).then(() => {
        return delStandards(Ids)
    }).then(() => {
        getList()
        ElMessage.success("删除成功")
    }).catch(() => {})
}
  onMounted(() => getList())
  </script>
  