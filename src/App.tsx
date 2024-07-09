import React, { useEffect, useState } from 'react';
import './index.css';
import type { GetProp, TableProps } from 'antd';
import { Space, Typography, Table, Button, Flex, message, Popconfirm, Modal, Form, Input } from 'antd';
import type { SorterResult } from 'antd/es/table/interface';

type ColumnsType<T> = TableProps<T>['columns'];
type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;

interface DataType {
  id: number;
  name: string;
  gender: string;
  email: string;
}

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: SorterResult<any>['field'];
  sortOrder?: SorterResult<any>['order'];
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1];
}

const { TextArea } = Input;

const App: React.FC = () => {
  const apiURL = process.env.VITE_API_URL + ':' + process.env.VITE_API_PORT;

  const [data, setData] = useState<DataType[]>();
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 5,
    },
    sortField: 'id',
    sortOrder: 'descend',
  });

  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalAdd, setIsModalAdd] = useState(true);
  const showAddModal = () => {
    setIsModalAdd(true);
    form.resetFields();
    setIsModalOpen(true);
  };
  const showEditModal = (record: DataType) => {
    setIsModalAdd(false);
    form.setFieldsValue({ id: record.id, name: record.name });
    setIsModalOpen(true);
  };
  const handleSave = () => {
    if (isModalAdd) {
      addDuty(form.getFieldValue('name'));
    } else {
      updateDuty(form.getFieldValue('id'), form.getFieldValue('name'));
    }
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const fetchData = () => {
    setLoading(true);
    fetch(apiURL + `/duty/list/` + tableParams.pagination?.current + `/` + tableParams.pagination?.pageSize + (tableParams.sortField === undefined ? '' : `/` + tableParams.sortField + (tableParams.sortOrder === undefined ? '' : '/' + tableParams.sortOrder)))
      .then((res) => res.json())
      .then(({ results, totalCount }) => {
        setData(results);
        setLoading(false);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: totalCount,
          },
        });
      });
  };

  const addDuty = (name: string) => {
    setLoading(true);
    const data = new URLSearchParams();
    data.append('name', name);
    fetch(apiURL + `/duty/create`, { method: 'POST', body: data })
      .then((res) => res.json())
      .then(({ result }) => {
        setLoading(false);
        message.success('Duty ' + result + ' added');
        form.resetFields();
        fetchData();
      });
  };

  const updateDuty = (id: number, name: string) => {
    setLoading(true);
    const data = new URLSearchParams();
    data.append('name', name);
    fetch(apiURL + `/duty/update/` + id, { method: 'PUT', body: data })
      .then(() => {
        setLoading(false);
        message.success('Duty ' + id + ' updated');
        form.resetFields();
        fetchData();
      });
  };

  const deleteDuty = (id: number) => {
    setLoading(true);
    fetch(apiURL + `/duty/delete/` + id, { method: 'DELETE' })
      .then(() => {
        setLoading(false);
        message.success('Duty ' + id + ' deleted');
        fetchData();
      });
  };

  const columns: ColumnsType<DataType> = [
    {
      title: '',
      dataIndex: 'id',
      width: '20%',
      render: (id, record) => (
        <Flex gap="small" wrap>
          <Button onClick={() => showEditModal(record)}>
            {"Edit"}
          </Button>
          <Popconfirm
            title="Delete Duty"
            description="Confirm to delete this duty?"
            onConfirm={() => deleteDuty(id)}
            okText="OK"
            cancelText="Cancel"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Flex>
       ),
    },
    {
      title: 'ID',
      dataIndex: 'id',
      width: '10%',
      sorter: true,
      defaultSortOrder: 'descend',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      width: '30%',
      ellipsis: true,
    },
    {
      title: 'Created Date',
      dataIndex: 'created_date',
      sorter: true,
    },
    {
      title: 'Modified Date',
      dataIndex: 'modified_date',
      sorter: true,
    },
  ];

  useEffect(() => {
    fetchData();
  }, [
    tableParams.pagination?.current,
    tableParams.pagination?.pageSize,
    tableParams?.sortOrder,
    tableParams?.sortField,
    JSON.stringify(tableParams.filters),
  ]);

  const handleTableChange: TableProps['onChange'] = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
      sortField: Array.isArray(sorter) ? undefined : sorter.field,
    });

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  };

  const formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 },
  };

  return (
    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
      <Typography.Title level={2} style={{ margin: 0 }}>
        TO-DO LIST
      </Typography.Title>
      <Flex gap="small" wrap>
        <Button type="primary" onClick={()=> showAddModal()}>
          {"Add"}
        </Button>
        <Button onClick={()=> fetchData()}>
          {"Refresh"}
        </Button>
      </Flex>
      <Table
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={data}
        pagination={tableParams.pagination}
        loading={loading}
        onChange={handleTableChange}
      />
      <Modal title={isModalAdd  ? "Add Duty" : "Edit Duty"}  open={isModalOpen} onOk={form.submit} onCancel={handleCancel}>
        <Form {...formLayout} form={form} onFinish={handleSave}>
          <Form.Item
            name="id"
            label="id"
          >
            <Input disabled/>
          </Form.Item>
          <Form.Item
            hasFeedback
            name="name"
            label="Name"
            validateFirst
            rules={[{ required: true, max: 255 }]}
          >
            <TextArea placeholder="Maximum 255 characters" />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
};

export default App;
