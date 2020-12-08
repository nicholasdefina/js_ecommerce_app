const layout = require('../layout');
const { getError } = require('../../helpers')

module.exports = ({ errors }) => {
    return layout({
      content: `

              <form method="POST">
                  <input required class="input" placeholder="Title" name="title" />
                  <p class="help is-danger">${getError(errors, 'title')}</p>
                  <input required class="input" placeholder="Price" name="price" />
                  <p class="help is-danger">${getError(errors, 'price')}</p>
                  <input type="file" class="input" placeholder="Password" name="image" />
                  <p class="help is-danger">${getError(errors, 'image')}</p>
                <button class="button is-primary">Submit</button>
              </form>
      `
    });
  };
  