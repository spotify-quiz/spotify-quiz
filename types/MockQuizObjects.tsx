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

  constructor(
    name: string,
    album: Array<Image>,
    preview_url: string,
    artist: string
  ) {
    this.name = name;
    this.album = album;
    this.preview_url = preview_url;
    this.artist = artist;
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
  tracks: Item;

  constructor(name: string, image: Image, tracks: Item) {
    this.name = name;
    this.image = image;
    this.tracks = tracks;
  }
}
export { Song, Image, Quiz, Track, Item };
