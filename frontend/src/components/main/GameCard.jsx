import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import '../style.css';

export function GameCard(game) {
    return (
      <div className='card'>
        <Card sx={{ maxWidth: 345 }}>
          <CardMedia
            component="img"
            height="140"
            image={game.imageUrl}
            alt={`"${game.title}"'s game card`}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div" sx={{fontSize: '2rem', fontWeight: '600', height: '5'}}>
              {game.title}
            </Typography>
            <Typography variant="body2" sx={{color: 'text.secondary', fontSize: '1.35rem'}}>
              {game.normalPrice != game.salePrice && <>Normal price: ${game.normalPrice} <br /></>}
              Current price: ${game.salePrice}
            </Typography>
          </CardContent>
        <CardActions>
          <Button size="large" color="primary" href={game.storeUrl} target='_blank'>
            Visitar loja
          </Button>
        </CardActions>
      </Card>
    </div>
  );
}