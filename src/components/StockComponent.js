import React from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import moment from 'moment';
import { Button } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import './../App.css';

export default class StockComponent extends React.Component {
  state = {
    stockList: [],
    openModal: false,
    selectedStock: {},
    idToDelete: "",
    isEditMode: false,
    isDeleteMode: false,
    isAddMode: false,
    showNotification: false,
    showModalAddStock: false
  }

  componentDidMount() {
    this.getAllBarang();
  }

  getAllBarang() {
    axios.get("http://localhost:3002/barang")
      .then(res => {
        const stockList = res.data;
        this.setState({ stockList });
      })
  }

  handleEditButton(value) {
    this.setState({ selectedStock: value, isEditMode: true });
    this.handleOpen();
  }

  handleAddButton() {
    this.setState({ selectedStock: {}, isAddMode: true });
    this.handleOpen();
  }

  handleSubmit() {
    const kode = document.getElementById("kode").value;
    const nama = document.getElementById("nama").value;
    const jumlah = document.getElementById("jumlah").value;
    const harga = document.getElementById("harga").value;
    const payload = {kode, nama, jumlah, harga}
    const {id} = this.state.selectedStock;
    if (id !== undefined) {
      axios.put(`http://localhost:3002/barang/${id}`, payload)
      .then(res => {
        this.setState({ openModal: false, showNotification: true })
        this.getAllBarang();
      })
      return;
    }

    axios.post("http://localhost:3002/barang", payload)
    .then(res => {
      this.setState({ openModal: false, showNotification: true })
      this.getAllBarang();
    })
  }

  handleDeleteButton(value) {
    this.setState({ 
      selectedStock: value, 
      idToDelete: value.id, 
      isDeleteMode: true
    })
    this.handleOpen();
  }

  handleDelete() {
    const {idToDelete} = this.state;
    axios.delete(`http://localhost:3002/barang/${idToDelete}`)
    .then(res => {
      this.setState({ openModal: false, showNotification: true })
      this.getAllBarang();
    })
  }

  handleClose() {
    this.setState({ 
      openModal: false, 
      showNotification: false, 
      isDeleteMode: false, 
      isEditMode: false,
      isAddMode:false,
      showModalAddStock:false});
  }
    
  handleOpen() {
    this.setState({ openModal: true });
  }

  handleOpenModalAddStock() {
    this.setState({ showModalAddStock: true });
  }

  handleAddStock() {
    const kodeBarang = document.getElementById("kodeTambah").value;
    const jumlah = document.getElementById("stockTambah").value;
    axios.put(`http://localhost:3002/barang/${kodeBarang}/${jumlah}`)
    .then(res => {
      this.getAllBarang();
      this.addTransaksi(kodeBarang, jumlah);
    })
  }

  addTransaksi(kodeBarang, jumlah) {
    const payload = { 
      kodeBarang, 
      kodeTransaksi: moment().format('DDMMYYYYhhmmss') * 1,
      jenisTransaksi: 'Restock', 
      jumlah,
      namaPembeli: '', 
      namaPenjual: 'Owner', 
      harga: 0,
      diskon: 0
    };
   axios.post("http://localhost:3002/transaction", [payload])
      .then(res => {
        this.setState({ showModalAddStock: false, showNotification: true })
    })
  }

  render() {
    var number = 0;
    return (
    <div className="Stock">
        <h1>Live Stock :</h1>
        <ButtonGroup className="mb-2">
          <Button variant="primary" onClick={() => this.handleAddButton()}>Tambah Barang</Button>
          <Button variant="secondary" onClick={() => this.handleOpenModalAddStock()}>Tambah Stock</Button>
        </ButtonGroup>
        <Table striped="columns" bordered hover>
            <thead>
                <tr>
                    <th>No</th>
                    <th>Kode</th>
                    <th>Nama</th>
                    <th>Jumlah Stock</th>
                    <th>Harga</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            {this.state.stockList.map((stock) => {
                number++;
                return (
                    <tbody key={stock.id}>
                        <tr>
                        <td>{number}</td>
                        <td>{stock.kode}</td>
                        <td>{stock.nama}</td>
                        <td>{stock.jumlah}</td>
                        <td>Rp. {new Intl.NumberFormat(['ban', 'id']).format(stock.harga)}</td>
                        <td>
                            <Button variant="primary" onClick={() => this.handleEditButton(stock)}>
                                Ubah Barang
                            </Button>
                            <a>   </a>
                            <Button variant="primary" onClick={() => this.handleDeleteButton(stock)}>
                                Hapus Barang
                            </Button>
                        </td>
                        </tr>
                    </tbody>
                )
            })}
        </Table>

        <Modal
        show={this.state.openModal}
        onHide={() => this.handleClose()}>
          <Modal.Header closeButton>
            <Modal.Title>Barang :</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3" controlId='kode'>
              <Form.Label>Kode</Form.Label>
              <Form.Control type="kode" disabled= {this.state.isDeleteMode} placeholder="Tulis Kode" defaultValue={this.state.selectedStock.kode}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId='nama'>
              <Form.Label>Nama</Form.Label>
              <Form.Control type="nama" disabled= {this.state.isDeleteMode} placeholder="Tulis Nama" defaultValue={this.state.selectedStock.nama}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId='jumlah'>
              <Form.Label>Jumlah</Form.Label>
              <Form.Control type="jumlah" disabled= {!this.state.isAddMode} placeholder="Tulis Jumlah" defaultValue={this.state.selectedStock.jumlah}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId='harga'>
              <Form.Label>Harga</Form.Label>
              <Form.Control type="harga" disabled= {this.state.isDeleteMode} placeholder="Tulis Harga" defaultValue={this.state.selectedStock.harga}/>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            { this.state.isAddMode && <Button variant="secondary" active={true} onClick={() => this.handleSubmit()}>
              Simpan
            </Button> }
            { this.state.isEditMode && <Button variant="secondary" active={true} onClick={() => this.handleSubmit()}>
              Ubah
            </Button> }
            { this.state.isDeleteMode && <Button variant="secondary" active={true} onClick={() => this.handleDelete()}>
              Hapus
            </Button> }
            <Button variant="primary" onClick={() => this.handleClose()}>
              Tutup
            </Button>
        </Modal.Footer>
        </Modal>

        <Modal 
        show={this.state.showModalAddStock}
        onHide={() => this.handleClose()}>
          <Modal.Header closeButton>
            <Modal.Title>Tambah Stock Barang :</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form.Group className="mb-3" controlId='jumlah'>
              <Form.Label>Kode Barang :</Form.Label>
              <Form.Select id='kodeTambah'>
                {this.state.stockList.map((stock) => {
                  return <option>{stock.kode}</option>
                })}
            </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId='stockTambah'>
              <Form.Label>Jumlah Stock Ditambahkan</Form.Label>
              <Form.Control type="number" placeholder="Tulis Jumlah"/>
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="primary" active={true} onClick={() => this.handleAddStock()}>
              Simpan
            </Button>
            <Button variant="secondary" active={true} onClick={() => this.handleClose()}>
              Close
            </Button>
        </Modal.Footer>
          
        </Modal>

        <Modal
        show={this.state.showNotification}>
          <Modal.Header closeButton>
          </Modal.Header>
          <Modal.Body>
            <h4>Success!!!</h4>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => this.handleClose()}>Close</Button>
          </Modal.Footer>
        </Modal>
    </div>
    )
  }
}