const ENDPOINT = "http://localhost:3000";

const loadTable = () => {
    axios.get(`${ENDPOINT}/states`)
        .then((response) => {
            if (response.status === 200) {
                const data = response.data;
                var trHTML = '';
                data.forEach(element => {
                    trHTML += '<tr>';
                    trHTML += '<td>' + element.id + '</td>';
                    trHTML += '<td>' + element.name + '</td>';
                    trHTML += '<td>' + element.province + '</td>';
                    trHTML += '<td><button type="button" class="btn btn-outline-secondary" onclick="showStateEditBox(' + element.id + ')">Edit</button>';
                    trHTML += '<button type="button" class="btn btn-outline-danger" onclick="stateDelete(' + element.id + ')">Del</button></td>';
                    trHTML += "</tr>";
                });
                document.getElementById("mytable").innerHTML = trHTML;
            }
        })
};

loadTable();

const stateCreate = () => {
    const name = document.getElementById("name").value;
    const province = document.getElementById("province").value;

    axios.post(`${ENDPOINT}/states`, {
        name: name,
        province: province,
    })
        .then((response) => {
            Swal.fire(`State ${response.data.name} created`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to create state: ${error.response.data.error} `)
                .then(() => {
                    showStateCreateBox();
                })
        });
}

const getState = (id) => {
    return axios.get(`${ENDPOINT}/states/` + id);
}

const stateEdit = () => {
    const id = document.getElementById("id").value;
    const name = document.getElementById("name").value;
    const province = document.getElementById("province").value;

    axios.put(`${ENDPOINT}/states/` + id, {
        name: name,
        province: province,
    })
        .then((response) => {
            Swal.fire(`State ${response.data.name} updated`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to update state: ${error.response.data.error} `)
                .then(() => {
                    showStateEditBox(id);
                })
        });
}

const stateDelete = async (id) => 
{
    if (!confirm('Confirma remoção?'))
    {
        return;
    }

    const state = await getState(id);
    const data = state.data;

    axios.delete(`${ENDPOINT}/states/` + id)
        .then((response) => {
            Swal.fire(`State ${data.name} deleted`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to delete state: ${error.response.data.error} `);
            loadTable();
        });
};

const showStateCreateBox = () => {
    Swal.fire({
        title: 'Create state',
        html:
            '<input id="id" type="hidden">' +
            '<input id="name" class="swal2-input" placeholder="Name">' +
            '<input id="province" class="swal2-input" placeholder="Province">',
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
            stateCreate();
        }
    });
}

const showStateEditBox = async (id) =>
{
    const state = await getState(id);
    const data = state.data;
    const cidades = await axios.get(`${ENDPOINT}/cities/?StateId=`+id);
    const result = cidades.data;

    let trHTML = '';

    for (let i in result)
    {
        let element = result[i];
        trHTML += '<tr>';
        trHTML += '<td>' + element.id + '</td>';
        trHTML += '<td>' + element.name + '</td>';
        trHTML += '<td><button type="button" class="btn btn-outline-secondary" ';
        trHTML += 'onclick="showCityEditBox(' + element.id + ')">Edit</button>';
        trHTML += '<button type="button" class="btn btn-outline-danger"';
        trHTML += 'onclick="cityDelete(' + element.id + ')">Del</button></td>';
        trHTML += "</tr>";
    }

    const table = `
    <h4>Cidades 
    <button type="button" 
    class="btn btn-secondary"
    style="float: right"
    onclick="showCityCreateBox(${id})">Create city
    </button>
    </h4>
    <div class="table-responsive">
        <table class="table">
            <thead>
                <tr>
                    <th>Código</th>
                    <th>Nome</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
            ${trHTML}
            </tbody>
        </table>
    </div>
    `;

    Swal.fire({
        title: 'Edit State',
        html:
            '<input id="id" type="hidden" value=' + data.id + '>' +
            '<input id="name" class="swal2-input" placeholder="Name" value="' + data.name + '">' +
            '<input id="province" class="swal2-input" placeholder="Province" value="' + data.province + '">'+
            table,

        focusConfirm: false,
        showCancelButton: true,
        customClass : 'big-swal',
        preConfirm: () => {
            stateEdit();
        }
    });

}
