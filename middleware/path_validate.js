exports.validate_path  = async(url, absolute_path ,  res) => {

    let result;
    const RgExp = new RegExp('^(?:[a-z]+:)?//', 'i');
    if (RgExp.test(url)) {
        //result = "This is Absolute URL.";
        result = url;
    } else {
        //result = "This is Relative URL.";
        result = absolute_path + url;
    }

    result = result.replace('/upload/upload/', '/upload/')
    return result;
};

exports.seo_url  = async(url , res) => {
    let result_url = url.toString();
    
    result_url = result_url.replaceAll(/\//g, '');
    result_url = result_url.toString()               // Convert to string
                            .normalize('NFD')               // Change diacritics
                            .replace(/[\u0300-\u036f]/g,'') // Remove illegal characters
                            .replace(/\s+/g,'-')            // Change whitespace to dashes
                            .toLowerCase()                  // Change to lowercase
                            .replace(/&/g,'-and-')          // Replace ampersand
                            .replace(/-+/g,'-')             // Remove duplicate dashes
                            .replace(/^-*/,'')              // Remove starting dashes
                            .replace(/-*$/,'');

    return result_url;  
}
