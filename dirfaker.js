directory_tree = {
  name:"~",
  tag: "Your Home Directory",
  type: "folder",
  children: {
    "Documents": {
      type: "folder",
      tag: "where the documents go",
      children: {
        "document": {
          type: "wordfile"
        },
        "school": {
          type: "folder",
          children: {}
        }
      }
    },
    "Photos": {
      type: "folder",
      children: {}
    },
    "Notes": {
      type: "folder",
      children: {}
    },
    "Reading List": {
      type: "folder",
      children: {}
    },
    "Downloads": {
      type: "folder",
      children: {}
    },
    "School": {
      type: "folder",
      children: {}
    },
    "Misc": {
      type: "folder",
      children: {}
    },
    ".config": {
      type: "dotfolder",
      children: {}
    },
    ".vimrc": {
      type: "dotfile"
    },
    ".bashrc": {
      type: "dotfile"
    },
    "notes.md": {
      type: "textfile"
    },
    "dolan.jpg": {
      type: "photofile"
    },
    "achive.zip": {
      type: "zipfile"
    },
    "My Mother's Straightjacket.mp3": {
      type: "audiofile"
    },
    "Why I Should Be President.odt": {
      type: "wordfile"
    }
  }
}

path = '~'
cwd = directory_tree;

function cwdd(c, spl) {
  if (spl.length == 0){
    return c
  } else {
    c = c.children[spl.splice(0,1)]
    if (c == undefined) {
      throw UserException("error traversing file tree")
    }
    return cwdd(c, spl)
  }
}

function compress_path(spl) {
  for (var i=0; i<spl.length; i++) {
    if (spl[i] == "." || spl[i] == "") {
      spl.splice(i,1);
      i--;
    } else if (spl[i] == "..") {
      spl.splice(i-1, 2);
      i-=2;
    } 
  }
  return spl
}

function update_cwd(newpath) {
  console.log("updating cwd :\""+newpath+"\"");  
  spl = newpath.split("/");
  spl_before = path.split("/");
  joined = spl_before.concat(spl);

  joined = compress_path(joined);
  joined.splice(0,1);

  console.log(joined);

  var nextpath;
  if (joined.length > 0) {
    nextpath = "~/"+joined.join("/");    
  } else {
    nextpath = "~"
  }


  temp = null
  try {
    temp = cwdd(directory_tree, joined)
    path = nextpath;
  } catch(err) {
    return 0
  }
  cwd = temp
  return 1
}

function update_cwd_tree(newpath) {
  if (update_cwd(newpath)) {
    $("#sidebar h2").text(path+"/");
    $("#navbar b").text(path+"/");
    $("#sidebar ul").empty()
    if (cwd.tag != undefined) {
      $("#navbar span").text(": " + cwd.tag);
    } else {
      $("#navbar span").text("");  
    }
    for (key in cwd.children) {
      $("#sidebar ul").append($("<li data-filetype="+cwd.children[key].type+">"+key+"</li>"));
    }
    return 1
  }
  return 0
}

update_cwd_tree("");