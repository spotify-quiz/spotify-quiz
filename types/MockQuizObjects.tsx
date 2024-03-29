class Image {
  url: string;
  width: number;
  height: number;

  constructor(url: string, width: number, height: number) {
    this.url = url;
    this.width = width;
    this.height = height;
  }
}

class Song {
  name: string;
  album: Array<Image>;
  preview_url: string;
  artist: string;
  album_name: string

  constructor(
    name: string,
    album: Array<Image>,
    preview_url: string,
    artist: string,
    album_name: string
  ) {
    this.name = name;
    this.album = album;
    this.preview_url = preview_url;
    this.artist = artist;
    this.album_name = album_name;
  }
}

class Track {
  track: Song;

  constructor(track: Song) {
    this.track = track;
  }
}

class Item {
  items: Array<Track>;

  constructor(items: Array<Track>) {
    this.items = items;
  }
}

class Quiz {
  name: string;
  image: Image;
  tracks: {
    items: Array<Track>; // Assuming this is an array of Track elements
  };

  constructor(name: string, image: Image, tracks: Item) {
    this.name = name;
    this.image = image;
    this.tracks = tracks;
  }
}
export { Song, Image, Quiz, Track, Item };
